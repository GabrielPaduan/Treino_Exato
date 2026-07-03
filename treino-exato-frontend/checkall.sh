#!/usr/bin/env bash
# ============================================================
# check_all.sh — verificacao end-to-end da task Criar Treino
# Nao altera nada. So le, valida e reporta. Exit 0 se tudo passa.
#
# Cobre: arquitetura em camadas (back), contrato de rotas,
# status HTTP, criterios da issue (front: MUI5, dark, service),
# consistencia baseURL, e typecheck real dos dois projetos.
# ============================================================
set -uo pipefail

REPO="$HOME/Estudos/Facul/EngenhariaDeSoftware/Treino_Exato"
BE="$REPO/treino-exato-backend"; BS="$BE/src"
FE="$REPO/treino-exato-frontend"; FS="$FE/src"
P=0; F=0
ok(){ printf '\033[1;32m[PASS]\033[0m %s\n' "$*"; P=$((P+1)); }
no(){ printf '\033[1;31m[FAIL]\033[0m %s\n' "$*"; F=$((F+1)); }
sec(){ printf '\n\033[1;36m== %s ==\033[0m\n' "$*"; }
has(){ [ -f "$1" ] && grep -qE "$2" "$1"; }

sec "BACKEND — camadas presentes"
for f in repositories/AlunoRepository.ts repositories/TreinoRepository.ts \
         services/AlunoService.ts services/TreinoService.ts \
         controllers/treino.controller.ts routes/treino.routes.ts; do
    [ -f "$BS/$f" ] && ok "$f" || no "$f ausente"
done

sec "BACKEND — arquitetura (controller nao toca supabase)"
if grep -q "supabase" "$BS/controllers/treino.controller.ts" 2>/dev/null; then
    no "controller referencia supabase (violacao de camada)"
else ok "controller isolado do supabase"; fi
# repository DEVE falar com supabase (senao nao esta acessando dado)
grep -q "supabase" "$BS/repositories/AlunoRepository.ts" && ok "repository acessa supabase" || no "repository sem supabase (?)"

sec "BACKEND — contrato de rotas + seguranca"
R="$BS/routes/treino.routes.ts"
has "$R" "get\('/alunos'"            && ok "GET /alunos"            || no "GET /alunos"
has "$R" "get\('/alunos/:cpf'"       && ok "GET /alunos/:cpf"       || no "GET /alunos/:cpf"
has "$R" "get\('/treinos/modelos'"   && ok "GET /treinos/modelos"   || no "GET /treinos/modelos"
has "$R" "post\('/treinos/associar'" && ok "POST /treinos/associar" || no "POST /treinos/associar"
has "$R" "verifyToken"               && ok "middleware verifyToken" || no "verifyToken ausente"
has "$R" "authorizeRoles\('PERSONAL'\)" && ok "authorizeRoles PERSONAL" || no "authorizeRoles ausente"

sec "BACKEND — status HTTP + try/catch"
C="$BS/controllers/treino.controller.ts"
has "$C" "status\(201\)" && ok "201 no associar" || no "201 ausente"
has "$C" "status\(404\)" && ok "404 no perfil"   || no "404 ausente"
has "$C" "status\(500\)" && ok "500 em erros"    || no "500 ausente"
has "$C" "try"           && ok "try/catch"        || no "sem try/catch"

sec "FRONTEND — arquivos + criterios da issue"
[ -f "$FS/shared/services/dashboardPersonalService.ts" ] && ok "dashboardPersonalService.ts" || no "service com nome errado"
[ -f "$FS/pages/CriarTreino/index.tsx" ] && ok "pagina CriarTreino" || no "pagina ausente"
P_="$FS/pages/CriarTreino/index.tsx"
has "$P_" "@mui/material" && ok "pagina usa MUI" || no "MUI ausente na pagina"
has "$P_" "severity=\"warning\"|WarningAmber" && ok "lesao destacada (alerta)" || no "lesao sem destaque"
has "$P_" "Nenhum aluno cadastrado" && ok "trata E1 (lista vazia)" || no "E1 ausente"
has "$P_" "Nenhum treino" && ok "trata A1 (sem treinos)" || no "A1 ausente"
has "$P_" "Erro ao cadastrar treino" && ok "trata E2 (falha POST)" || no "E2 ausente"

sec "FRONTEND — MUI v5 exato (issue)"
MV="$(node -p "try{require('$FE/node_modules/@mui/material/package.json').version}catch(e){'0'}" 2>/dev/null)"
[ "${MV%%.*}" = "5" ] && ok "MUI v$MV (major 5)" || no "MUI major != 5 (esta $MV)"

sec "FRONTEND — tema dark + ThemeProvider"
has "$FS/shared/themes/index.ts" "mode: 'dark'" && ok "tema dark configurado" || no "tema nao e dark"
has "$FS/App.tsx" "ThemeProvider" && ok "App usa ThemeProvider" || no "ThemeProvider nao aplicado"

sec "FRONTEND — baseURL sem /api/api"
BASE_API=0; SVC_API=0
grep -q "localhost:8080/api" "$FS/shared/services/api.ts" 2>/dev/null && BASE_API=1
grep -qE "api\.(get|post)\('/api/" "$FS/shared/services/dashboardPersonalService.ts" 2>/dev/null && SVC_API=1
if [ "$BASE_API" = 1 ] && [ "$SVC_API" = 1 ]; then no "DUPLICACAO /api/api"; else ok "sem duplicacao de /api"; fi

sec "TYPECHECK"
cd "$BE" && node_modules/.bin/tsc --noEmit 2>/tmp/be.log && ok "backend tsc limpo" || { no "backend tsc (ver /tmp/be.log)"; }
cd "$FE" && node_modules/.bin/tsc -p tsconfig.app.json --noEmit 2>/tmp/fe.log && ok "frontend tsc limpo" || { no "frontend tsc (ver /tmp/fe.log)"; }

echo ""
printf '=== RESULTADO: \033[1;32m%d PASS\033[0m / \033[1;31m%d FAIL\033[0m ===\n' "$P" "$F"
[ "$F" -eq 0 ]
