/**
 * Управление жизненным циклом приложения
 * Обработка событий паузы, возобновления и т.д.
 */

document.addEventListener('deviceready', initAppLifecycle, false);

// Также инициализируем для случая, когда страница открыта как PWA
window.addEventListener('load', function() {
    // Проверяем, запущено ли уже через Cordova
    if (typeof window.cordova === 'undefined') {
        // Для PWA используем события visibilitychange вместо событий Cordova
        initPwaLifecycle();
    }
});

function initAppLifecycle() {
    // Добавляем обработчики событий Cordova
    document.addEventListener('pause', handleAppPause, false);
    document.addEventListener('resume', handleAppResume, false);
    document.addEventListener('backbutton', handleBackButton, false);
    document.addEventListener('menubutton', handleMenuButton, false);
    
    console.log('App lifecycle management initialized (Cordova)');
}

function initPwaLifecycle() {
    // Для PWA используем события видимости документа
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    
    // Обработка событий от сервис-воркера
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }
    
    console.log('App lifecycle management initialized (PWA)');
}

function handleAppPause() {
    console.log('App paused');
    
    // Сохраняем состояние приложения при постановке на паузу
    saveAppState();
    
    // Останавливаем любые таймеры или анимации
    if (sprintState.timerId) {
        clearInterval(sprintState.timerId);
    }
}

function handleAppResume() {
    console.log('App resumed');
    
    // Восстанавливаем состояние, если нужно
    restoreAppState();
    
    // Обновляем UI после возобновления работы
    if (state.currentMode) {
        const initFunction = modeInitializers[state.currentMode];
        if (initFunction) initFunction();
    }
}

function handleBackButton() {
    console.log('Back button pressed');
    
    // Определяем текущий контекст и выполняем соответствующее действие назад
    if (state.currentMode) {
        showSubMenu(state.currentModule);
    } else if (state.currentModule) {
        showTopMenu();
    } else {
        // Если мы в главном меню, спрашиваем пользователя, хочет ли он выйти
        if (confirm('Вы хотите выйти из приложения?')) {
            navigator.app.exitApp();
        }
    }
}

function handleMenuButton() {
    console.log('Menu button pressed');
    // Реализуйте здесь логику работы с меню
}

function handleVisibilityChange() {
    if (document.hidden) {
        console.log('App visibility hidden');
        // Похоже на паузу в Cordova
        saveAppState();
        
        // Останавливаем любые таймеры или анимации
        if (sprintState.timerId) {
            clearInterval(sprintState.timerId);
        }
    } else {
        console.log('App visibility visible');
        // Похоже на возобновление в Cordova
        restoreAppState();
    }
}

function handleServiceWorkerMessage(event) {
    console.log('Service Worker message:', event.data);
    
    // Обработка сообщений от сервис-воркера
    if (event.data && event.data.type === 'CACHE_UPDATED') {
        // Если было обновление кэша, можно показать уведомление пользователю
        showUpdateNotification();
    }
}

function saveAppState() {
    // Сохраняем текущее состояние приложения в localStorage
    const appState = {
        currentModule: state.currentModule,
        currentMode: state.currentMode,
        isPremium: state.isPremium,
        timestamp: Date.now()
    };
    
    localStorage.setItem('superTrainerAppState', JSON.stringify(appState));
}

function restoreAppState() {
    // Восстанавливаем состояние из localStorage
    try {
        const savedState = localStorage.getItem('superTrainerAppState');
        if (savedState) {
            const appState = JSON.parse(savedState);
            
            // Если состояние было сохранено недавно (менее 30 минут назад), восстанавливаем его
            if (Date.now() - appState.timestamp < 30 * 60 * 1000) {
                state.isPremium = appState.isPremium;
                
                // Если приложение было в каком-то разделе, возвращаемся в него
                if (appState.currentMode) {
                    // Сначала восстанавливаем модуль
                    if (appState.currentModule) {
                        showSubMenu(appState.currentModule);
                    }
                    // Затем режим
                    startMode(appState.currentMode);
                } else if (appState.currentModule) {
                    showSubMenu(appState.currentModule);
                }
            }
        }
    } catch (error) {
        console.error('Error restoring app state:', error);
    }
}

function showUpdateNotification() {
    // Показываем уведомление о доступном обновлении
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-0 left-0 right-0 p-4 bg-green-600 text-white text-center font-bold';
    notification.textContent = 'Доступно обновление! Перезагрузите страницу для применения.';
    notification.style.zIndex = '9999';
    
    const reloadButton = document.createElement('button');
    reloadButton.className = 'ml-4 px-4 py-2 bg-white text-green-600 rounded-lg font-bold';
    reloadButton.textContent = 'Обновить сейчас';
    reloadButton.onclick = () => window.location.reload();
    
    notification.appendChild(reloadButton);
    document.body.appendChild(notification);
}