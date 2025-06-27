# Супер-тренажер Android App

Образовательное мобильное приложение для изучения таблицы умножения, времени и времен года с freemium-моделью.

## 🎯 Особенности

- **Три обучающих модуля:**
  - 🔢 Мастер Умножения (таблица умножения с ассоциациями)
  - ⏰ Повелитель Времени (изучение времени и часов)
  - 📅 Календарь Природы (времена года и месяцы)

- **Freemium модель:**
  - Бесплатная версия: числа до 3
  - Премиум версия: полный доступ до 10
  - Интеграция с Google Play Billing

- **Игровые режимы:**
  - Интерактивные карточки со стихами
  - Визуализатор умножения
  - Таблица Пифагора
  - Спринт на время
  - Финальный экзамен
  - И многое другое!

## 🚀 Установка и сборка

### Предварительные требования

1. **Node.js** (версия 14 или выше)
2. **Cordova CLI**:
   ```bash
   npm install -g cordova
   ```
3. **Android Studio** с Android SDK
4. **Java Development Kit (JDK) 8 или 11**

### Настройка среды

1. Установите переменные окружения:
   ```bash
   # Android SDK
   export ANDROID_SDK_ROOT=/path/to/android-sdk
   export PATH=$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools
   
   # Java
   export JAVA_HOME=/path/to/jdk
   ```

2. Проверьте установку:
   ```bash
   cordova requirements android
   ```

### Сборка проекта

1. **Установка зависимостей:**
   ```bash
   cd super-trainer-android
   npm install
   ```

2. **Добавление Android платформы:**
   ```bash
   cordova platform add android
   ```

3. **Установка плагинов:**
   ```bash
   cordova plugin add cordova-plugin-whitelist
   cordova plugin add cordova-plugin-statusbar
   cordova plugin add cordova-plugin-device
   cordova plugin add cordova-plugin-splashscreen
   cordova plugin add cordova-plugin-inappbrowser
   cordova plugin add cordova-plugin-dialogs
   cordova plugin add cordova-plugin-vibration
   cordova plugin add cordova-plugin-network-information
   cordova plugin add cordova-plugin-file
   cordova plugin add cordova-plugin-purchase
   ```

4. **Сборка для отладки:**
   ```bash
   cordova build android
   ```

5. **Сборка для релиза:**
   ```bash
   cordova build android --release
   ```

### Запуск на устройстве

1. **Подключите Android устройство или запустите эмулятор**

2. **Запуск:**
   ```bash
   cordova run android
   ```

## 📱 Подготовка к Google Play Store

### 1. Создание ключа подписи

```bash
keytool -genkey -v -keystore super-trainer-release-key.keystore -alias super-trainer -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Настройка build.json

Создайте файл `build.json`:

```json
{
  "android": {
    "release": {
      "keystore": "super-trainer-release-key.keystore",
      "storePassword": "your-store-password",
      "alias": "super-trainer",
      "password": "your-alias-password"
    }
  }
}
```

### 3. Сборка подписанного APK

```bash
cordova build android --release --buildConfig=build.json
```

### 4. Генерация AAB (рекомендуется для Play Store)

В `config.xml` добавьте:

```xml
<preference name="AndroidPackageFormat" value="aab" />
```

Затем:

```bash
cordova build android --release --buildConfig=build.json
```

## 💰 Настройка Google Play Billing

### 1. Настройка в Google Play Console

1. Создайте приложение в Google Play Console
2. Настройте внутренние покупки:
   - Product ID: `premium_version`
   - Type: Managed product
   - Price: установите нужную цену

### 2. Тестирование покупок

1. Добавьте тестовые аккаунты в Google Play Console
2. Загрузите тестовую версию приложения
3. Протестируйте процесс покупки

### 3. Обновление конфигурации

В файле `js/billing.js` при необходимости измените:

```javascript
store.register({
    id: 'premium_version',        // Ваш Product ID
    type: store.PAID_SUBSCRIPTION, // Или store.CONSUMABLE для разовых покупок
    alias: 'Премиум версия'
});
```

## 🎨 Настройка иконок и splash screens

### Автоматическая генерация

1. Установите cordova-res:
   ```bash
   npm install -g cordova-res
   ```

2. Поместите файлы:
   - `icon.png` (1024x1024) в корень проекта
   - `splash.png` (2732x2732) в корень проекта

3. Генерация:
   ```bash
   cordova-res android --skip-config --copy
   ```

### Ручная настройка

Поместите иконки в папки:
- `www/res/icon/android/` - иконки разных размеров
- `www/res/screen/android/` - splash screens разных размеров

## 🔧 Структура проекта

```
super-trainer-android/
├── config.xml                 # Конфигурация Cordova
├── package.json               # Зависимости Node.js
├── www/                       # Веб-приложение
│   ├── index.html            # Главная страница
│   ├── css/
│   │   └── app-styles.css    # Стили приложения
│   ├── js/
│   │   ├── app.js           # Основная логика
│   │   ├── billing.js       # Google Play Billing
│   │   ├── game-modes.js    # Игровые режимы
│   │   └── time-modes.js    # Режимы времени
│   ├── img/                 # Изображения
│   └── res/                 # Ресурсы (иконки, splash)
└── platforms/               # Платформы (автогенерируется)
```

## 🐛 Отладка

### Логи Android

```bash
# Подключите устройство и запустите:
adb logcat | grep -i "console\|error\|cordova"
```

### Chrome DevTools

1. Откройте Chrome
2. Перейдите на `chrome://inspect`
3. Найдите ваше устройство и приложение
4. Нажмите "Inspect"

### Отладка в эмуляторе

```bash
# Запуск в режиме отладки
cordova run android --debug
```

## 📋 Чек-лист для релиза

- [ ] Протестировано на реальных устройствах
- [ ] Настроены иконки и splash screens
- [ ] Настроен Google Play Billing
- [ ] Создан подписанный AAB файл
- [ ] Проверены разрешения в AndroidManifest.xml
- [ ] Обновлена версия в config.xml
- [ ] Подготовлены скриншоты для Play Store
- [ ] Написано описание приложения

## 🚨 Важные замечания

1. **Версии SDK**: Приложение требует минимум Android API 22 (Android 5.1)
2. **Разрешения**: Приложение использует INTERNET, VIBRATE, BILLING
3. **Тестирование**: Обязательно протестируйте на разных размерах экранов
4. **Производительность**: Приложение оптимизировано для планшетов и телефонов

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи через `adb logcat`
2. Убедитесь в правильности настройки Android SDK
3. Проверьте версии Cordova и плагинов

---

**Успешной публикации в Google Play Store! 🚀**
