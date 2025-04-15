@echo off
SETLOCAL

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%..\"
set "NODE_MODULES_PATH=%ROOT_DIR%node_modules"
set "PLUGIN_PATH=%NODE_MODULES_PATH%\.bin\protoc-gen-ts_proto.cmd"

:: Проверка наличия плагина
if not exist "%PLUGIN_PATH%" (
    echo Error: protoc-gen-ts_proto not found. Install ts-proto first.
    echo Run: npm install --save-dev ts-proto
    exit /b 1
)

:: Выходная директория
set "OUTPUT_DIR=%SCRIPT_DIR%generated"
mkdir "%OUTPUT_DIR%" 2>nul

:: Директория с proto-файлами
set "PROTO_DIR=%SCRIPT_DIR%proto"

:: Перебираем все .proto файлы в папке proto
for %%F in ("%PROTO_DIR%\*.proto") do (
    echo Generating types for: %%~nxF
    protoc ^
      --plugin=protoc-gen-ts_proto="%PLUGIN_PATH%" ^
      --ts_proto_out="%OUTPUT_DIR%" ^
      --ts_proto_opt=outputServices=grpc-js,nestJs=true,addGrpcMetadata=true,addNestjsRestParameter=true,returnObservable=false,snakeToCamel=false ^
      -I="%PROTO_DIR%" ^
      "%%F"
)

echo All types generated successfully in: %OUTPUT_DIR%
ENDLOCAL