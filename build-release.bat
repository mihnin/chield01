@echo off
echo ========================================
echo  Супер-тренажер - Сборка для Google Play
echo ========================================
echo.

REM Проверка наличия build.json
if not exist build.json (
    echo ОШИБКА: Файл build.json не найден!
    echo.
    echo Создайте build.json с настройками подписи:
    echo {
    echo   "android": {
    echo     "release": {
    echo       "keystore": "super-trainer-release-key.keystore",
    echo       "storePassword": "your-store-password",
    echo       "alias": "super-trainer", 
    echo       "password": "your-alias-password"
    echo     }
    echo   }
    echo }
    echo.
    pause
    exit /b 1
)

REM Проверка наличия keystore файла
set /p KEYSTORE_FILE=< build.json | findstr "keystore"
if not exist "super-trainer-release-key.keystore" (
    echo ПРЕДУПРЕЖДЕНИЕ: Keystore файл не найден!
    echo Создайте ключ подписи командой:
    echo keytool -genkey -v -keystore super-trainer-release-key.keystore -alias super-trainer -keyalg RSA -keysize 2048 -validity 10000
    echo.
    set /p CONTINUE="Продолжить сборку без подписи? (y/N): "
    if /i not "%CONTINUE%"=="y" exit /b 1
)

echo [1/4] Очистка предыдущих сборок...
call cordova clean android

echo [2/4] Настройка для AAB (Android App Bundle)...
REM AAB настройка уже в config.xml

echo [3/4] Сборка релизной версии...
if exist build.json (
    call cordova build android --release --buildConfig=build.json
) else (
    call cordova build android --release
)

if %errorlevel% neq 0 goto error

echo [4/4] Готово!
echo.
echo ========================================
echo Релизные файлы созданы в:
echo - AAB: platforms\android\app\build\outputs\bundle\release\
echo - APK: platforms\android\app\build\outputs\apk\release\
echo.
echo AAB файл рекомендуется для публикации в Google Play Store
echo ========================================
echo.

REM Показать размеры файлов
echo Размеры файлов:
if exist "platforms\android\app\build\outputs\bundle\release\app-release.aab" (
    for %%I in ("platforms\android\app\build\outputs\bundle\release\app-release.aab") do echo AAB: %%~zI bytes
)
if exist "platforms\android\app\build\outputs\apk\release\app-release.apk" (
    for %%I in ("platforms\android\app\build\outputs\apk\release\app-release.apk") do echo APK: %%~zI bytes
)

echo.
echo Следующие шаги:
echo 1. Протестируйте AAB/APK на реальных устройствах
echo 2. Подготовьте описание и скриншоты для Play Store
echo 3. Загрузите AAB файл в Google Play Console
echo.
pause
exit /b 0

:error
echo.
echo ОШИБКА при сборке релизной версии!
echo Проверьте:
echo - Настройки подписи в build.json
echo - Наличие keystore файла
echo - Переменные окружения Android SDK
echo.
pause
exit /b 1
