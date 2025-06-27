// Интеграция с Google Play Billing для покупок

let store = null;

document.addEventListener('deviceready', initializeBilling, false);

function initializeBilling() {
    if (!window.store) {
        console.log('Store plugin не найден');
        return;
    }

    store = window.store;

    // Настройка обработчиков событий
    store.register({
        id: 'premium_version',
        type: store.PAID_SUBSCRIPTION,
        alias: 'Премиум версия'
    });

    store.error(onStoreError);
    store.ready(onStoreReady);
    store.when('premium_version').approved(onPremiumApproved);
    store.when('premium_version').verified(onPremiumVerified);
    store.when('premium_version').updated(onPremiumUpdated);

    // Инициализация магазина
    store.refresh();
}

function onStoreReady() {
    console.log('Store готов к работе');
    
    // Проверяем, есть ли уже активная подписка
    const premiumProduct = store.get('premium_version');
    if (premiumProduct && premiumProduct.owned) {
        console.log('Премиум версия уже активна');
        activatePremium();
    }
}

function onStoreError(error) {
    console.log('Ошибка Store:', error);
    
    // Показываем пользователю сообщение об ошибке
    if (navigator.notification) {
        navigator.notification.alert(
            'Произошла ошибка при обращении к магазину. Попробуйте позже.',
            null,
            'Ошибка',
            'ОК'
        );
    }
}

function onPremiumApproved(product) {
    console.log('Премиум одобрен:', product);
    
    // Завершаем транзакцию
    product.verify();
}

function onPremiumVerified(product) {
    console.log('Премиум верифицирован:', product);
    
    // Активируем премиум функции
    activatePremium();
    
    // Завершаем транзакцию
    product.finish();
}

function onPremiumUpdated(product) {
    console.log('Статус премиума обновлен:', product);
    
    if (product.owned) {
        activatePremium();
    }
}

// Функция для запуска покупки
function purchasePremiumVersion() {
    if (!store) {
        console.log('Store не инициализирован');
        // Для тестирования активируем премиум сразу
        activatePremium();
        return;
    }

    // Показываем индикатор загрузки
    showLoadingSpinner();

    try {
        store.order('premium_version');
    } catch (error) {
        console.log('Ошибка при покупке:', error);
        hideLoadingSpinner();
        
        if (navigator.notification) {
            navigator.notification.alert(
                'Не удалось инициировать покупку. Попробуйте позже.',
                null,
                'Ошибка покупки',
                'ОК'
            );
        }
    }
}

// Функция для восстановления покупок
function restorePurchases() {
    if (!store) {
        console.log('Store не инициализирован');
        return;
    }

    showLoadingSpinner();
    
    try {
        store.refresh();
        
        setTimeout(() => {
            hideLoadingSpinner();
            
            const premiumProduct = store.get('premium_version');
            if (premiumProduct && premiumProduct.owned) {
                activatePremium();
                
                if (navigator.notification) {
                    navigator.notification.alert(
                        'Премиум версия успешно восстановлена!',
                        null,
                        'Покупки восстановлены',
                        'ОК'
                    );
                }
            } else {
                if (navigator.notification) {
                    navigator.notification.alert(
                        'Активных покупок не найдено.',
                        null,
                        'Восстановление покупок',
                        'ОК'
                    );
                }
            }
        }, 2000);
        
    } catch (error) {
        console.log('Ошибка при восстановлении:', error);
        hideLoadingSpinner();
    }
}

// Вспомогательные функции для UI
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'billing-spinner';
    spinner.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    spinner.innerHTML = `
        <div class="bg-white p-6 rounded-lg flex flex-col items-center">
            <div class="loading-spinner mb-4"></div>
            <p class="text-gray-700 font-semibold">Обработка покупки...</p>
        </div>
    `;
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('billing-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Обновляем функцию purchasePremium в основном коде
function purchasePremium() {
    if (window.store && store) {
        purchasePremiumVersion();
    } else {
        // Для тестирования - сразу активируем премиум
        activatePremium();
    }
}

// Функция для получения информации о продукте
function getPremiumProductInfo() {
    if (!store) {
        return null;
    }
    
    return store.get('premium_version');
}

// Функция для проверки статуса премиума
function checkPremiumStatus() {
    if (!store) {
        return false;
    }
    
    const premiumProduct = store.get('premium_version');
    return premiumProduct && premiumProduct.owned;
}

// Экспорт функций для использования в других модулях
window.billing = {
    purchasePremium: purchasePremium,
    restorePurchases: restorePurchases,
    getPremiumProductInfo: getPremiumProductInfo,
    checkPremiumStatus: checkPremiumStatus
};
