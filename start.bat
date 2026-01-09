@echo off
echo ==============================
echo Iniciando o projeto...
echo ==============================

REM Verifica se node_modules existe
IF NOT EXIST node_modules (
  echo Instalando dependencias...
  npm install
)

echo Iniciando servidor de desenvolvimento...
npm run dev

pause
