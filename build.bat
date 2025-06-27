@echo off
echo ========================================
echo  Супер-тренажер - Сборка Android App
echo ========================================
echo.

REM Проверка наличия Cordova
cordova --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Cordova не установлена!
    echo Установите: npm install -g cordova
    pause
    exit /b 1
)

echo [1/6] Установка зависимостей...
call npm install
if %errorlevel% neq 0 goto error

echo [2/6] Добавление Android платформы...
call cordova platform add android
if %errorlevel% neq 0 goto add_platform_skip

:add_platform_skip
echo [3/6] Установка плагинов...
call cordova plugin add cordova-plugin-whitelist
call cordova plugin add cordova-plugin-statusbar  
call cordova plugin add cordova-plugin-device
call cordova plugin add cordova-plugin-splashscreen
call cordova plugin add cordova-plugin-inappbrowser
call cordova plugin add cordova-plugin-dialogs
call cordova plugin add cordova-plugin-vibration
call cordova plugin add cordova-plugin-network-information
call cordova plugin add cordova-plugin-file
call cordova plugin add cordova-plugin-purchase

echo [4/6] Проверка требований Android...
call cordova requirements android
if %errorlevel% neq 0 (
    echo ПРЕДУПРЕЖДЕНИЕ: Не все требования выполнены!
    echo Убедитесь, что установлены Android SDK и Java
    pause
)

echo [5/6] Сборка для отладки...
call cordova build android
if %errorlevel% neq 0 goto error

echo [6/6] Готово!
echo.
echo ========================================
echo APK файл создан в: platforms\android\app\build\outputs\apk\debug\
echo Для установки на устройство запустите: cordova run android
echo ========================================
echo.
pause
exit /b 0

:error
echo.
echo ОШИБКА при сборке приложения!
echo Проверьте логи выше для получения подробностей.
pause
exit /b 1
