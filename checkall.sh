#!/usr/bin/env bash
set -uo pipefail
REPO="$HOME/Estudos/Facul/EngenhariaDeSoftware/Treino_Exato"
BE="$REPO/treino-exato-backend"; BS="$BE/src"
FE="$REPO/treino-exato-frontend"; FS="$FE/src"
P=0; F=0
ok(){ printf '\033[1;32m[PASS]\033[0m %s\n' "$*"; P=$((P+1)); }
no(){ printf '\033[1;31m[FAIL]\033[0m %s\n' "$*"; F=$((F+1)); }
sec(){ printf '\n\033[1;36m== %s ==\033[0m\n' "$*"; }
has(){ [ -f "$1" ] && grep -qE "$2" "$1"; }

sec "BACKEND camadas"
for f in repositories/AlunoRepository.ts repositories/TreinoRepository.ts services/AlunoService.ts services/TreinoService.ts controllers/treino.controller.ts routes/treino.routes.ts; do
    [ -f "$BS/$f" ] && ok "$f" || no "$f ausente"
done

sec "BACKEND arquitetura"
grep -q supabase "$BS/controllers/treino.controller.ts" 2>/dev/null && no "controller toca supabase" || ok "controller isolado"
grep -q supabase "$BS/repositories/AlunoRepository.ts" 2>/dev/null && ok "repository acessa supabase" || no "repository sem supabase"

sec "BACKEND rotas"
R="$BS/routes/treino.routes.ts"
has "$R" "get\('/alunos'" && ok "GET /alunos" || no "GET /alunos"
has "$R" "get\('/alunos/:cpf'" && ok "GET /alunos/:cpf" || no "GET /alunos/:cpf"
has "$R" "get\('/treinos/modelos'" && ok "GET /treinos/modelos" || no "GET /treinos/modelos"
has "$R" "post\('/treinos/associar'" && ok "POST /treinos/associar" || no "POST /treinos/associar"
has "$R" "verifyToken" && ok "verifyToken" || no "verifyToken"
has "$R" "authorizeRoles\('PERSONAL'\)" && ok "authorizeRoles PERSONAL" || no "authorizeRoles"

sec "BACKEND status HTTP"
C="$BS/controllers/treino.controller.ts"
has "$C" "status\(201\)" && ok "201" || no "201"
has "$C" "status\(404\)" && ok "404" || no "404"
has "$C" "status\(500\)" && ok "500" || no "500"
has "$C" "try" && ok "try/catch" || no "try/catch"

sec "FRONTEND arquivos + issue"
[ -f "$FS/shared/services/dashboardPersonalService.ts" ] && ok "dashboardPersonalService.ts" || no "service nome errado"
P_="$FS/pages/CriarTreino/index.tsx"
[ -f "$P_" ] && ok "pagina existe" || no "pagina ausente"
has "$P_" "@mui/material" && ok "pagina usa MUI" || no "MUI ausente"
has "$P_" "WarningAmber|severity=.warning." && ok "lesao destacada" || no "lesao sem destaque"
has "$P_" "Nenhum aluno cadastrado" && ok "E1" || no "E1"
has "$P_" "Nenhum treino" && ok "A1" || no "A1"
has "$P_" "Erro ao cadastrar treino" && ok "E2" || no "E2"

sec "FRONTEND MUI v5"
MV="$(node -p "try{require('$FE/node_modules/@mui/material/package.json').version}catch(e){'0'}" 2>/dev/null)"
[ "${MV%%.*}" = "5" ] && ok "MUI v$MV" || no "MUI major != 5 ($MV)"

sec "FRONTEND tema + rota"
has "$FS/shared/themes/index.ts" "mode: 'dark'" && ok "tema dark" || no "tema nao dark"
has "$FS/App.tsx" "ThemeProvider" && ok "ThemeProvider" || no "ThemeProvider ausente"
has "$FS/routes/index.tsx" "criar-treino" && ok "rota /criar-treino" || no "rota /criar-treino NAO registrada"

sec "TYPECHECK"
cd "$BE" && node_modules/.bin/tsc --noEmit 2>/dev/null && ok "backend tsc" || no "backend tsc"
cd "$FE" && node_modules/.bin/tsc -p tsconfig.app.json --noEmit 2>/dev/null && ok "frontend tsc" || no "frontend tsc"

printf '\n=== \033[1;32m%d PASS\033[0m / \033[1;31m%d FAIL\033[0m ===\n' "$P" "$F"
[ "$F" -eq 0 ]
