/**
 * Скрипт для мониторинга состояния сети и уведомления пользователя
 */

document.addEventListener('deviceready', initNetworkMonitoring, false);

// Также инициализируем для случая когда страница открыта как PWA
window.addEventListener('load', function() {
    // Проверяем, запущено ли уже через Cordova
    if (typeof window.cordova === 'undefined') {
        initNetworkMonitoring();
    }
});

function initNetworkMonitoring() {
    // Создаем контейнер для уведомлений о статусе сети
    createNetworkNotification();
    
    // Инициализируем мониторинг сети
    updateOnlineStatus();
    
    // Слушаем изменения состояния сети
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Для Cordova используем плагин Network Information если доступен
    if (typeof navigator.connection !== 'undefined') {
        document.addEventListener("offline", updateOnlineStatus, false);
        document.addEventListener("online", updateOnlineStatus, false);
    }
}

function createNetworkNotification() {
    // Создаем элемент уведомления если его еще нет
    if (!document.getElementById('network-status')) {
        const notification = document.createElement('div');
        notification.id = 'network-status';
        notification.className = 'hidden fixed top-0 left-0 right-0 p-2 text-center text-white font-bold transition-all duration-300 z-50';
        notification.innerHTML = `
            <span id="network-status-message"></span>
            <button id="network-status-close" class="ml-2 px-2 py-1 rounded-full bg-white bg-opacity-30">✕</button>
        `;
        
        document.body.appendChild(notification);
        
        // Добавляем обработчик для кнопки закрытия
        document.getElementById('network-status-close').addEventListener('click', function() {
            document.getElementById('network-status').classList.add('hidden');
        });
    }
}

function updateOnlineStatus() {
    const statusElement = document.getElementById('network-status');
    const messageElement = document.getElementById('network-status-message');
    
    if (!statusElement || !messageElement) return;
    
    const isOnline = navigator.onLine;
    
    if (isOnline) {
        statusElement.classList.remove('bg-red-600');
        statusElement.classList.add('bg-green-600');
        messageElement.textContent = 'Соединение с интернетом восстановлено';
        
        // Показываем уведомление на короткое время
        statusElement.classList.remove('hidden');
        setTimeout(function() {
            statusElement.classList.add('hidden');
        }, 3000);
    } else {
        statusElement.classList.remove('bg-green-600');
        statusElement.classList.add('bg-red-600');
        messageElement.textContent = 'Нет подключения к интернету. Приложение работает в автономном режиме';
        
        // Показываем уведомление пока соединение не восстановится
        statusElement.classList.remove('hidden');
    }
}