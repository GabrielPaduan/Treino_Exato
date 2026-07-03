#!/usr/bin/env bash
# ============================================================
# fix_frontend_criar_treino.sh
# Fecha o frontend da task Criar Treino conforme a issue:
#   - MUI v5 (remove qualquer versao !=5)
#   - tema dark via ThemeProvider (createTheme mode:'dark')
#   - service renomeado para dashboardPersonalService
#   - pagina importando o service correto
# Idempotente: so age no que estiver divergente. Prova: tsc --noEmit.
#
# tsconfig do front = moduleResolution "bundler" -> imports SEM .js
# (oposto do backend nodenext). Por isso nenhum import leva extensao aqui.
# ============================================================
set -uo pipefail

FE="$HOME/Estudos/Facul/EngenhariaDeSoftware/Treino_Exato/treino-exato-frontend"
SRC="$FE/src"
ok(){  printf '\033[1;32m[OK]\033[0m  %s\n' "$*"; }
fix(){ printf '\033[1;33m[FIX]\033[0m %s\n' "$*"; }
er(){  printf '\033[1;31m[ERR]\033[0m %s\n' "$*" >&2; }

[ -d "$SRC" ] || { er "frontend nao encontrado em $SRC"; exit 1; }
cd "$FE"

# ------------------------------------------------------------
# 1. MUI v5 — a issue exige v5. Detecta versao major instalada.
# ------------------------------------------------------------
MUI_VER="$(node -p "try{require('@mui/material/package.json').version}catch(e){'0'}" 2>/dev/null)"
MUI_MAJOR="${MUI_VER%%.*}"
if [ "$MUI_MAJOR" = "5" ]; then
    ok "MUI ja em v5 ($MUI_VER)"
else
    fix "MUI em v$MUI_VER -> forcando v5 (issue exige v5)"
    npm remove @mui/material @mui/icons-material >/dev/null 2>&1 || true
    # React 19 no projeto -> peer dep do MUI5 aponta React 18; legacy-peer-deps evita travar.
    npm install --save --legacy-peer-deps @mui/material@5 @mui/icons-material@5 @emotion/react @emotion/styled >/dev/null 2>&1
    NEW_VER="$(node -p "require('@mui/material/package.json').version" 2>/dev/null || echo '?')"
    if [ "${NEW_VER%%.*}" = "5" ]; then ok "MUI reinstalado em $NEW_VER"; else er "falha ao fixar MUI v5 (ficou $NEW_VER)"; fi
fi

# ------------------------------------------------------------
# 2. Tema dark — arquivo existe mas estava vazio.
# ------------------------------------------------------------
TEMA="$SRC/shared/themes/index.ts"
read -r -d '' TEMA_CONTENT << 'EOF' || true
import { createTheme } from '@mui/material/styles';

// Tema escuro corporativo exigido pela issue ("padrao visual escuro via ThemeProvider").
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#0f0f0f', paper: '#1a1a1a' },
        primary: { main: '#4ade80' },
    },
    shape: { borderRadius: 12 },
});
EOF
if [ -f "$TEMA" ] && grep -q "createTheme" "$TEMA" && grep -q "mode: 'dark'" "$TEMA"; then
    ok "tema dark ja configurado"
else
    printf '%s\n' "$TEMA_CONTENT" > "$TEMA"
    fix "tema dark escrito (createTheme mode:dark)"
fi

# ------------------------------------------------------------
# 3. Service renomeado treino.service -> dashboardPersonalService
# ------------------------------------------------------------
OLD="$SRC/shared/services/treino.service.ts"
NEW="$SRC/shared/services/dashboardPersonalService.ts"
if [ -f "$NEW" ] && [ ! -f "$OLD" ]; then
    ok "service ja e dashboardPersonalService"
elif [ -f "$OLD" ]; then
    if git ls-files --error-unmatch "$OLD" >/dev/null 2>&1; then
        git mv "$OLD" "$NEW"
    else
        mv "$OLD" "$NEW"
    fi
    fix "service renomeado -> dashboardPersonalService.ts"
else
    er "nenhum service encontrado (nem treino.service nem dashboardPersonalService)"
fi
# garante nome do export
if [ -f "$NEW" ]; then
    if grep -q "export const dashboardPersonalService" "$NEW"; then
        ok "export dashboardPersonalService presente"
    else
        sed -i 's/export const TreinoService/export const dashboardPersonalService/' "$NEW"
        fix "export renomeado -> dashboardPersonalService"
    fi
fi

# ------------------------------------------------------------
# 4. Pagina: import + uso apontando pro service novo
# ------------------------------------------------------------
PAGE="$SRC/pages/CriarTreino/index.tsx"
if [ -f "$PAGE" ]; then
    sed -i "s#from '../../shared/services/treino.service'#from '../../shared/services/dashboardPersonalService'#" "$PAGE"
    sed -i 's/{ TreinoService,/{ dashboardPersonalService,/; s/TreinoService\./dashboardPersonalService./g' "$PAGE"
    if grep -q "dashboardPersonalService" "$PAGE" && ! grep -q "TreinoService" "$PAGE"; then
        ok "pagina usa dashboardPersonalService"
    else
        er "pagina ainda referencia TreinoService — revise $PAGE manualmente"
    fi
else
    er "pagina CriarTreino/index.tsx ausente"
fi

# ------------------------------------------------------------
# 5. App.tsx com ThemeProvider + CssBaseline
# ------------------------------------------------------------
APP="$SRC/App.tsx"
if grep -q "ThemeProvider" "$APP" 2>/dev/null; then
    ok "App.tsx ja tem ThemeProvider"
else
    [ -f "$APP" ] && cp "$APP" "$APP.bak"
    cat > "$APP" << 'EOF'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRoutes } from '../src/routes/index';
import { darkTheme } from './shared/themes';

export const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
};
EOF
    fix "App.tsx envolto em ThemeProvider (backup em App.tsx.bak)"
fi

# ------------------------------------------------------------
# 6. Guard: baseURL vs prefixo do service (evitar /api/api)
# ------------------------------------------------------------
API="$SRC/shared/services/api.ts"
BASE_HAS_API=0; SVC_HAS_API=0
grep -q "baseURL:.*localhost:8080/api" "$API" 2>/dev/null && BASE_HAS_API=1
grep -qE "api\.(get|post)\('/api/" "$NEW" 2>/dev/null && SVC_HAS_API=1
if [ "$BASE_HAS_API" = "1" ] && [ "$SVC_HAS_API" = "1" ]; then
    er "DUPLICACAO /api/api: baseURL tem /api E service prefixa /api. Corrija um dos dois."
else
    ok "baseURL/prefixo consistentes (sem /api/api)"
fi

# ------------------------------------------------------------
# 7. Prova
# ------------------------------------------------------------
echo "---- tsc -p tsconfig.app.json --noEmit ----"
if node_modules/.bin/tsc -p tsconfig.app.json --noEmit; then
    ok "typecheck limpo"
    echo "FRONTEND OK"
    exit 0
else
    er "typecheck falhou (veja acima)"
    exit 1
fi
