// Ожидание события deviceready от Cordova
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Cordova device is ready!');
    
    // Настройки статус-бара
    if (StatusBar) {
        StatusBar.styleDefault();
        StatusBar.overlaysWebView(false);
    }
    
    // Обработка кнопки "назад" на Android
    document.addEventListener("backbutton", onBackKeyDown, false);
    
    // Инициализация приложения
    initializeApp();
}

function onBackKeyDown() {
    // Обработка нажатия кнопки "назад"
    if (state.currentMode) {
        showSubMenu(state.currentModule);
    } else if (state.currentModule) {
        showTopMenu();
    } else {
        // Спрашиваем о выходе из приложения
        navigator.notification.confirm(
            'Выйти из приложения?',
            onConfirmExit,
            'Супер-тренажер',
            ['Выйти', 'Отмена']
        );
    }
}

function onConfirmExit(buttonIndex) {
    if (buttonIndex === 1) {
        navigator.app.exitApp();
    }
}

function initializeApp() {
    // Инициализация основного функционала приложения
    loadUserData();
}

// --- GLOBAL STATE & NAVIGATION ---
const topLevelMenu = document.getElementById('top-level-menu');
const multiplicationMenu = document.getElementById('multiplication-menu');
const timeMenu = document.getElementById('time-menu');
const calendarMenu = document.getElementById('calendar-menu');
const modeContainer = document.getElementById('mode-container');

let state = { currentModule: null, currentMode: null, isPremium: false };
let sprintState = {};
let examState = {};

// Функция для сохранения данных пользователя
function saveUserData() {
    const userData = {
        isPremium: state.isPremium,
        lastOpened: new Date().toISOString()
    };
    
    localStorage.setItem('superTrainerData', JSON.stringify(userData));
}

// Функция для загрузки данных пользователя
function loadUserData() {
    try {
        const savedData = localStorage.getItem('superTrainerData');
        if (savedData) {
            const userData = JSON.parse(savedData);
            state.isPremium = userData.isPremium || false;
        }
    } catch (error) {
        console.log('Ошибка загрузки данных пользователя:', error);
    }
}

// Функция для проверки доступа к платному контенту
function isPremiumContent(num1, num2) {
    return (num1 > 3 || num2 > 3) && !state.isPremium;
}

// Функция для покупки премиум-версии
function purchasePremium() {
    // Интеграция с Google Play Billing будет здесь
    if (window.store) {
        // Запускаем процесс покупки через cordova-plugin-purchase
        window.store.order('premium_version').then(() => {
            console.log('Покупка успешна!');
        }).catch((error) => {
            console.log('Ошибка покупки:', error);
        });
    } else {
        // Для тестирования - сразу активируем премиум
        activatePremium();
    }
}

function activatePremium() {
    state.isPremium = true;
    saveUserData();
    
    // Показываем уведомление
    if (navigator.notification) {
        navigator.notification.alert(
            'Поздравляем! Вы приобрели полную версию приложения!',
            null,
            'Премиум активирован',
            'ОК'
        );
    } else {
        alert('Поздравляем! Вы приобрели полную версию приложения!');
    }
    
    // Перерисовываем текущий режим, если он активен
    if (state.currentMode) {
        const initFunction = modeInitializers[state.currentMode];
        if (initFunction) initFunction();
    } else if (state.currentModule) {
        renderSubMenu(state.currentModule);
    }
    
    // Скрываем баннер премиум, если он есть
    const premiumBanner = document.getElementById('premium-banner');
    if (premiumBanner) premiumBanner.classList.add('hidden');
}

function showTopMenu() {
    [multiplicationMenu, timeMenu, calendarMenu, modeContainer].forEach(el => el.classList.add('hidden'));
    topLevelMenu.classList.remove('hidden');
    state.currentModule = null; state.currentMode = null;
    if (sprintState.timerId) clearInterval(sprintState.timerId);
}

function showSubMenu(module) {
    state.currentModule = module;
    [topLevelMenu, modeContainer].forEach(el => el.classList.add('hidden'));
    const menus = { 'multiplication': multiplicationMenu, 'time': timeMenu, 'calendar': calendarMenu };
    Object.values(menus).forEach(m => m.classList.add('hidden'));
    menus[module].classList.remove('hidden');
    renderSubMenu(module);
}

function startMode(modeId) {
    state.currentMode = modeId;
    [multiplicationMenu, timeMenu, calendarMenu].forEach(el => el.classList.add('hidden'));
    modeContainer.classList.remove('hidden');

    modeContainer.innerHTML = `<button onclick="showSubMenu(state.currentModule)" class="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold">‹ Назад</button>`;
    const contentDiv = document.createElement('div');
    contentDiv.id = `${modeId}-mode`;
    modeContainer.appendChild(contentDiv);

    const initFunction = modeInitializers[modeId];
    if (initFunction) initFunction();
}

// --- RENDER SUB-MENUS ---
function renderSubMenu(module) {
    const menusData = {
        'multiplication': {
            title: "Мастер Умножения", color: "blue", buttons: [
                { id: 'cards', text: 'Карточки со стихами' }, 
                { id: 'visualizer', text: 'Визуализатор' },
                { id: 'pythagoras', text: 'Таблица Пифагора' }, 
                { id: 'factors', text: 'Найди множители', premium: true },
                { id: 'sprint', text: 'Спринт на время', premium: true }, 
                { id: 'exam', text: 'Финальный Экзамен', premium: true }
            ]
        },
        'time': {
            title: "Повелитель Времени", color: "teal", buttons: [
                { id: 'interactive-clock', text: 'Интерактивные Часы' }, 
                { id: 'time-of-day', text: 'Время Суток' },
                { id: 'what-time', text: 'Тренажер "Который час?"' }, 
                { id: 'word-magic', text: 'Магия Слов', full: true }
            ]
        },
        'calendar': {
            title: "Календарь Природы", color: "lime", buttons: [
                { id: 'seasons', text: 'Времена Года и Месяцы', full: true }
            ]
        }
    };
    const data = menusData[module];
    const container = document.getElementById(`${module}-menu`);
    container.innerHTML = `
        <button onclick="showTopMenu()" class="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold">‹ Главное меню</button>
        <h2 class="text-3xl font-bold text-center text-${data.color}-600 mb-6">${data.title}</h2>
        ${!state.isPremium ? `
        <div id="premium-banner" class="bg-amber-100 border-2 border-amber-300 p-4 rounded-xl mb-6 premium-banner">
            <p class="text-center text-amber-800 mb-2"><strong>Бесплатная версия:</strong> Таблица умножения доступна только до 3!</p>
            <div class="text-center">
                <button onclick="purchasePremium()" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold">
                    <span class="premium-badge">PRO</span> Разблокировать полную версию
                </button>
            </div>
        </div>` : ''}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${data.buttons.map(btn => `
                <button
                    onclick="${btn.premium && !state.isPremium ? 'purchasePremium()' : `startMode('${btn.id}')`}"
                    class="mode-button p-6 text-xl text-center ${btn.premium && !state.isPremium ? 'bg-gray-400' : `bg-${btn.color || data.color}-500`} text-white rounded-2xl ${btn.full ? 'md:col-span-2' : ''} relative overflow-hidden touch-target"
                >
                    ${btn.text}
                    ${btn.premium && !state.isPremium ? '<span class="absolute top-1 right-2 text-xs bg-amber-500 text-white px-2 py-1 rounded-full premium-badge">PRO</span>' : ''}
                </button>
            `).join('')}
        </div>`;
}

// --- DATA ---
const rhymes = { 
    "1x1": "Один на один - всегда господин!", 
    "1x2": "Один на два - едва-едва.", 
    "1x3": "Один на три - посмотри.", 
    "1x4": "Один на четыре - нет в целом мире.", 
    "1x5": "Один на пять - легко считать.", 
    "1x6": "Один на шесть - так и есть.", 
    "1x7": "Один на семь - понятно всем.", 
    "1x8": "Один на восемь - мы тебя попросим.", 
    "1x9": "Один на девять - нечего делать.", 
    "1x10": "Один на десять - можно взвесить.", 
    "2x2":"Дважды два - четыре, это знают все на свете.", 
    "2x3":"Дважды три - будет шесть, надо кашу чаще есть.",
    "2x4":"Дважды четыре - восемь, мы грибочки в кузов носим.",
    "2x5":"Дважды пять - десять, просто нолик приписать.",
    "2x6":"Дважды шесть - двенадцать, нечего тут сомневаться.",
    "2x7":"Дважды семь - четырнадцать, будем спортом заниматься.",
    "2x8":"Дважды восемь - шестнадцать, нужно чаще улыбаться.",
    "2x9":"Дважды девять - восемнадцать, будем дружно мы смеяться.",
    "2x10": "Два на десять - двадцать, будем, братцы, умываться.", 
    "3x3":"Трижды три - девять, в чудеса надо верить.",
    "3x4":"Три на четыре – двенадцать, год гуляет по планете.",
    "3x5":"Трижды пять - пятнадцать, чисто в комнате опять.",
    "3x6":"Трижды шесть - восемнадцать, жаль, что нам не восемнадцать.",
    "3x7":"Трижды семь - двадцать один, победим, ведь мы одни.",
    "3x8":"Три на восемь - двадцать четыре, нет меня счастливей в мире.",
    "3x9":"Трижды девять - двадцать семь, это помнить нужно всем.",
    "3x10": "Три на десять - тридцать, надо к солнцу стремиться."
};

const seasonsData = [ 
    { name: "Декабрь", num: 12, season: "Зима", icon: "🎄", color: "#38bdf8", bg: "bg-sky-100" }, 
    { name: "Январь", num: 1, season: "Зима", icon: "❄️", color: "#60a5fa", bg: "bg-sky-100" }, 
    { name: "Февраль", num: 2, season: "Зима", icon: "⛄", color: "#93c5fd", bg: "bg-sky-100" }, 
    { name: "Март", num: 3, season: "Весна", icon: "🌱", color: "#4ade80", bg: "bg-green-100" }, 
    { name: "Апрель", num: 4, season: "Весна", icon: "💧", color: "#34d399", bg: "bg-green-100" }, 
    { name: "Май", num: 5, season: "Весна", icon: "🌸", color: "#a7f3d0", bg: "bg-green-100" }, 
    { name: "Июнь", num: 6, season: "Лето", icon: "☀️", color: "#facc15", bg: "bg-yellow-100" }, 
    { name: "Июль", num: 7, season: "Лето", icon: "🍓", color: "#fde047", bg: "bg-yellow-100" }, 
    { name: "Август", num: 8, season: "Лето", icon: "🦋", color: "#fef08a", bg: "bg-yellow-100" }, 
    { name: "Сентябрь", num: 9, season: "Осень", icon: "🍁", color: "#fb923c", bg: "bg-orange-100" }, 
    { name: "Октябрь", num: 10, season: "Осень", icon: "🍄", color: "#fdba74", bg: "bg-orange-100" }, 
    { name: "Ноябрь", num: 11, season: "Осень", icon: "🍂", color: "#fed7aa", bg: "bg-orange-100" } 
];

const seasonRhymes = { 
    "Зима": "Снег летит, мороз трещит, это Зимушка спешит!", 
    "Весна": "Ручейки бегут, звеня, к нам пришла Весна-красна!", 
    "Лето": "Солнце, ягоды, цветы, Лето — это я и ты!", 
    "Осень": "Листья падают, шурша, Осень очень хороша!" 
};

const wordMagicData = [ 
    { phrase: "Половина третьего", answer: "02:30" }, 
    { phrase: "Без четверти семь", answer: "06:45" }, 
    { phrase: "Пятнадцать минут десятого", answer: "09:15" }, 
    { phrase: "Ровно полдень", answer: "12:00" }, 
    { phrase: "Двадцать минут шестого", answer: "05:20" }, 
    { phrase: "Без десяти два", answer: "01:50" } 
];

// --- MODE INITIALIZERS MAPPING ---
const modeInitializers = {
    'cards': initCardsMode, 
    'visualizer': initVisualizerMode, 
    'pythagoras': initPythagorasMode, 
    'factors': initFactorsMode, 
    'sprint': initSprintMode, 
    'exam': initExamMode,
    'interactive-clock': initInteractiveClock, 
    'time-of-day': initTimeOfDay, 
    'seasons': initSeasons, 
    'what-time': initWhatTime, 
    'word-magic': initWordMagic
};

// --- MODE INITIALIZERS ---
function initCardsMode() {
    const container = document.getElementById("cards-mode");
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-4">Карточки со стихами</h2>
        ${!state.isPremium ? `
        <div class="bg-amber-100 border-2 border-amber-300 p-4 rounded-xl mb-6 premium-banner">
            <p class="text-center text-amber-800 mb-2"><strong>Бесплатная версия:</strong> Доступны карточки с числами до 3!</p>
            <div class="text-center">
                <button onclick="purchasePremium()" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold">
                    <span class="premium-badge">PRO</span> Разблокировать полную версию
                </button>
            </div>
        </div>` : ''}
        <div id="card-area" class="h-80 flex items-center justify-center"></div>
        <div class="flex justify-center mt-4">
            <button id="next-card-btn" class="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg touch-target">Следующая</button>
        </div>`;
    
    const cardArea = container.querySelector("#card-area");
    const nextCardBtn = container.querySelector("#next-card-btn");
    
    function generateNewCard() {
        const maxNum = state.isPremium ? 10 : 3;
        
        let num1 = Math.floor(maxNum * Math.random()) + 1;
        let num2 = Math.floor(maxNum * Math.random()) + 1;
        let answer = num1 * num2;
        let rhymeKey = `${Math.min(num1, num2)}x${Math.max(num1, num2)}`;
        let association = rhymes[rhymeKey] || "Отличный пример!";
        
        cardArea.innerHTML = `<div id="interactive-card" class="card w-80 h-64 cursor-pointer no-select">
            <div class="card-inner">
                <div class="card-face card-front">
                    <p class="text-6xl font-extrabold">${num1} x ${num2}</p>
                    <p class="mt-4 text-sm font-light">(Нажми)</p>
                </div>
                <div class="card-face card-back">
                    <p class="text-7xl font-extrabold">${answer}</p>
                    <p class="mt-2 text-center text-base px-2">${association}</p>
                </div>
            </div>
        </div>`;
        
        cardArea.querySelector("#interactive-card").addEventListener("click", (e => {
            e.currentTarget.classList.toggle("is-flipped");
            // Вибрация при переворачивании карточки
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }));
    }
    
    generateNewCard();
    nextCardBtn.onclick = generateNewCard;
}

// Инициализация других режимов через модули
function initVisualizerMode() {
    if (window.gameModes && window.gameModes.initVisualizerMode) {
        window.gameModes.initVisualizerMode();
    }
}

function initPythagorasMode() {
    if (window.gameModes && window.gameModes.initPythagorasMode) {
        window.gameModes.initPythagorasMode();
    }
}

function initFactorsMode() {
    if (window.gameModes && window.gameModes.initFactorsMode) {
        window.gameModes.initFactorsMode();
    }
}

function initSprintMode() {
    if (window.gameModes && window.gameModes.initSprintMode) {
        window.gameModes.initSprintMode();
    }
}

function initExamMode() {
    if (window.gameModes && window.gameModes.initExamMode) {
        window.gameModes.initExamMode();
    }
}

function initInteractiveClock() {
    if (window.timeModes && window.timeModes.initInteractiveClock) {
        window.timeModes.initInteractiveClock();
    }
}

function initTimeOfDay() {
    if (window.timeModes && window.timeModes.initTimeOfDay) {
        window.timeModes.initTimeOfDay();
    }
}

function initWhatTime() {
    if (window.timeModes && window.timeModes.initWhatTime) {
        window.timeModes.initWhatTime();
    }
}

function initWordMagic() {
    if (window.timeModes && window.timeModes.initWordMagic) {
        window.timeModes.initWordMagic();
    }
}

function initSeasons() {
    if (window.timeModes && window.timeModes.initSeasons) {
        window.timeModes.initSeasons();
    }
}

// Добавлю остальные функции инициализации режимов...
