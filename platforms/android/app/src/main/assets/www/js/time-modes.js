// Режимы времени и календаря для Супер-тренажера

function initInteractiveClock() {
    const container = document.getElementById("interactive-clock-mode");
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-4">Интерактивные Часы</h2>
        <div class="flex flex-col items-center">
            <div class="clock mb-6">
                <div id="hour-hand" class="hand hour-hand"></div>
                <div id="minute-hand" class="hand minute-hand"></div>
                <div class="center-dot"></div>
                ${Array.from({length: 12}, (_, i) => {
                    const angle = (i + 1) * 30 - 90;
                    const x = 50 + 35 * Math.cos(angle * Math.PI / 180);
                    const y = 50 + 35 * Math.sin(angle * Math.PI / 180);
                    return `<div style="position: absolute; left: ${x}%; top: ${y}%; transform: translate(-50%, -50%); font-weight: bold; font-size: 18px;">${i + 1}</div>`;
                }).join('')}
            </div>
            <div class="flex items-center space-x-4 mb-4">
                <label class="text-lg font-semibold">Часы:</label>
                <input type="number" id="hour-input" min="1" max="12" value="3" class="w-20 p-2 text-center border-2 rounded touch-target">
                <label class="text-lg font-semibold">Минуты:</label>
                <select id="minute-input" class="w-24 p-2 border-2 rounded touch-target">
                    <option value="0">00</option>
                    <option value="15">15</option>
                    <option value="30" selected>30</option>
                    <option value="45">45</option>
                </select>
            </div>
            <div class="text-center">
                <div id="digital-time" class="text-3xl font-bold text-blue-600 mb-4">03:30</div>
                <button id="random-time" class="bg-blue-500 text-white font-bold py-2 px-6 rounded-full touch-target">Случайное время</button>
            </div>
        </div>`;
    
    const hourHand = container.querySelector("#hour-hand");
    const minuteHand = container.querySelector("#minute-hand");
    const hourInput = container.querySelector("#hour-input");
    const minuteInput = container.querySelector("#minute-input");
    const digitalTime = container.querySelector("#digital-time");
    const randomBtn = container.querySelector("#random-time");
    
    function updateClock() {
        const hours = parseInt(hourInput.value) || 3;
        const minutes = parseInt(minuteInput.value) || 30;
        
        // Угол для минутной стрелки (6 градусов за минуту)
        const minuteAngle = minutes * 6;
        
        // Угол для часовой стрелки (30 градусов за час + 0.5 градуса за минуту)
        const hourAngle = (hours % 12) * 30 + minutes * 0.5;
        
        minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
        
        digitalTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Вибрация при изменении времени
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }
    
    function randomTime() {
        const randomHour = Math.floor(Math.random() * 12) + 1;
        const randomMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        
        hourInput.value = randomHour;
        minuteInput.value = randomMinute;
        updateClock();
    }
    
    hourInput.oninput = updateClock;
    minuteInput.onchange = updateClock;
    randomBtn.onclick = randomTime;
    
    updateClock();
}

function initTimeOfDay() {
    const container = document.getElementById("time-of-day-mode");
    
    const timeOfDayData = [
        { time: "06:00", period: "Утро", icon: "🌅", description: "Рассвет, птички поют" },
        { time: "08:00", period: "Утро", icon: "☀️", description: "Время завтрака" },
        { time: "12:00", period: "День", icon: "🌞", description: "Полдень, солнце высоко" },
        { time: "15:00", period: "День", icon: "🌤️", description: "После обеда" },
        { time: "18:00", period: "Вечер", icon: "🌇", description: "Закат, ужин" },
        { time: "21:00", period: "Вечер", icon: "🌙", description: "Время спать" },
        { time: "00:00", period: "Ночь", icon: "🌌", description: "Полночь, все спят" },
        { time: "03:00", period: "Ночь", icon: "⭐", description: "Глубокая ночь" }
    ];
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-6">Время Суток</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${timeOfDayData.map(item => `
                <div class="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl border-2 border-blue-200 hover:scale-105 transition-transform cursor-pointer time-card no-select touch-target" data-period="${item.period}">
                    <div class="text-center">
                        <div class="text-4xl mb-2">${item.icon}</div>
                        <div class="text-2xl font-bold text-blue-800 mb-1">${item.time}</div>
                        <div class="text-lg font-semibold text-purple-700 mb-2">${item.period}</div>
                        <div class="text-sm text-gray-600">${item.description}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="mt-8 text-center">
            <div id="current-period" class="text-2xl font-bold text-green-600 mb-4">Сейчас: ${getCurrentPeriod()}</div>
            <button id="quiz-mode" class="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Режим викторины</button>
        </div>`;
    
    function getCurrentPeriod() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour >= 6 && hour < 12) return "Утро 🌅";
        if (hour >= 12 && hour < 18) return "День 🌞";
        if (hour >= 18 && hour < 22) return "Вечер 🌇";
        return "Ночь 🌌";
    }
    
    // Добавляем интерактивность карточкам
    container.querySelectorAll('.time-card').forEach(card => {
        card.addEventListener('click', () => {
            // Вибрация при нажатии
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Анимация
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 100);
            }, 100);
        });
    });
    
    const quizBtn = container.querySelector("#quiz-mode");
    quizBtn.onclick = () => startTimeQuiz(timeOfDayData, container);
}

function startTimeQuiz(timeOfDayData, container) {
    let currentQuestion = 0;
    let score = 0;
    const totalQuestions = 5;
    
    function showQuestion() {
        if (currentQuestion >= totalQuestions) {
            showQuizResults();
            return;
        }
        
        const randomItem = timeOfDayData[Math.floor(Math.random() * timeOfDayData.length)];
        const wrongAnswers = timeOfDayData
            .filter(item => item.period !== randomItem.period)
            .map(item => item.period)
            .filter((value, index, self) => self.indexOf(value) === index)
            .slice(0, 3);
        
        const allAnswers = [randomItem.period, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <h2 class="text-3xl font-bold text-center mb-6">Викторина: Время суток</h2>
            <div class="text-center">
                <div class="text-lg mb-4">Вопрос ${currentQuestion + 1} из ${totalQuestions}</div>
                <div class="text-6xl mb-4">${randomItem.icon}</div>
                <div class="text-3xl font-bold mb-2">${randomItem.time}</div>
                <div class="text-lg text-gray-600 mb-6">${randomItem.description}</div>
                <p class="text-xl font-semibold mb-6">Какое это время суток?</p>
                <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    ${allAnswers.map(answer => `
                        <button class="quiz-answer bg-blue-200 hover:bg-blue-300 p-4 rounded-lg font-bold touch-target" data-answer="${answer}">${answer}</button>
                    `).join('')}
                </div>
                <div id="quiz-feedback" class="mt-4 text-xl font-bold h-6"></div>
            </div>`;
        
        container.querySelectorAll('.quiz-answer').forEach(btn => {
            btn.onclick = () => checkTimeAnswer(btn.dataset.answer, randomItem.period);
        });
    }
    
    function checkTimeAnswer(selected, correct) {
        const feedback = container.querySelector('#quiz-feedback');
        const isCorrect = selected === correct;
        
        if (isCorrect) {
            score++;
            feedback.textContent = "Правильно! ✓";
            feedback.className = "mt-4 text-xl font-bold h-6 text-green-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else {
            feedback.textContent = `Неверно. Правильный ответ: ${correct}`;
            feedback.className = "mt-4 text-xl font-bold h-6 text-red-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }
        
        container.querySelectorAll('.quiz-answer').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === correct) {
                btn.classList.add('bg-green-500', 'text-white');
            } else if (btn.dataset.answer === selected && !isCorrect) {
                btn.classList.add('bg-red-500', 'text-white');
            }
        });
        
        currentQuestion++;
        setTimeout(showQuestion, 2000);
    }
    
    function showQuizResults() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = "Попробуй еще раз!";
        let color = "text-red-500";
        
        if (percentage >= 80) {
            message = "Отлично! 🏆";
            color = "text-green-500";
        } else if (percentage >= 60) {
            message = "Хорошо! 👍";
            color = "text-blue-500";
        }
        
        container.innerHTML = `
            <h2 class="text-3xl font-bold text-center mb-6">Результаты викторины</h2>
            <div class="text-center bg-gray-100 p-8 rounded-2xl">
                <div class="text-6xl font-extrabold mb-4 ${color}">${percentage}%</div>
                <div class="text-2xl font-bold mb-4 ${color}">${message}</div>
                <div class="text-lg mb-6">Правильных ответов: ${score} из ${totalQuestions}</div>
                <button onclick="startMode('time-of-day')" class="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Начать заново</button>
            </div>`;
        
        if (navigator.vibrate) {
            if (percentage >= 80) {
                navigator.vibrate([100, 50, 100, 50, 100]);
            } else {
                navigator.vibrate(200);
            }
        }
    }
    
    showQuestion();
}

function initWhatTime() {
    const container = document.getElementById("what-time-mode");
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-6">Тренажер "Который час?"</h2>
        <div class="text-center">
            <div class="clock mb-6 mx-auto">
                <div id="quiz-hour-hand" class="hand hour-hand"></div>
                <div id="quiz-minute-hand" class="hand minute-hand"></div>
                <div class="center-dot"></div>
                ${Array.from({length: 12}, (_, i) => {
                    const angle = (i + 1) * 30 - 90;
                    const x = 50 + 35 * Math.cos(angle * Math.PI / 180);
                    const y = 50 + 35 * Math.sin(angle * Math.PI / 180);
                    return `<div style="position: absolute; left: ${x}%; top: ${y}%; transform: translate(-50%, -50%); font-weight: bold; font-size: 18px;">${i + 1}</div>`;
                }).join('')}
            </div>
            <p class="text-xl font-semibold mb-4">Который час показывают часы?</p>
            <div class="flex justify-center items-center space-x-4 mb-6">
                <input type="number" id="answer-hour" min="1" max="12" placeholder="Час" class="w-20 p-3 text-center border-2 rounded-lg touch-target">
                <span class="text-2xl font-bold">:</span>
                <select id="answer-minute" class="w-24 p-3 border-2 rounded-lg touch-target">
                    <option value="">Мин</option>
                    <option value="0">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                </select>
            </div>
            <button id="check-time" class="bg-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Проверить</button>
            <div id="time-feedback" class="mt-4 text-xl font-bold h-6"></div>
            <div class="mt-6">
                <div id="time-score" class="text-lg font-semibold text-green-600 mb-2">Правильных ответов: 0</div>
                <button id="next-time" class="bg-blue-500 text-white font-bold py-2 px-6 rounded-full touch-target">Следующий вопрос</button>
            </div>
        </div>`;
    
    const hourHand = container.querySelector("#quiz-hour-hand");
    const minuteHand = container.querySelector("#quiz-minute-hand");
    const answerHour = container.querySelector("#answer-hour");
    const answerMinute = container.querySelector("#answer-minute");
    const checkBtn = container.querySelector("#check-time");
    const feedback = container.querySelector("#time-feedback");
    const scoreEl = container.querySelector("#time-score");
    const nextBtn = container.querySelector("#next-time");
    
    let currentHour = 0;
    let currentMinute = 0;
    let score = 0;
    
    function generateNewTime() {
        currentHour = Math.floor(Math.random() * 12) + 1;
        currentMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        
        const minuteAngle = currentMinute * 6;
        const hourAngle = (currentHour % 12) * 30 + currentMinute * 0.5;
        
        minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
        
        answerHour.value = "";
        answerMinute.value = "";
        feedback.textContent = "";
        answerHour.focus();
    }
    
    function checkTime() {
        const userHour = parseInt(answerHour.value);
        const userMinute = parseInt(answerMinute.value);
        
        if (userHour === currentHour && userMinute === currentMinute) {
            score++;
            scoreEl.textContent = `Правильных ответов: ${score}`;
            feedback.textContent = "Правильно! 🎉";
            feedback.className = "mt-4 text-xl font-bold h-6 text-green-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        } else {
            feedback.textContent = `Неверно. Правильное время: ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            feedback.className = "mt-4 text-xl font-bold h-6 text-red-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        }
    }
    
    checkBtn.onclick = checkTime;
    nextBtn.onclick = generateNewTime;
    
    answerHour.addEventListener("keypress", (e => { if (e.key === "Enter") checkTime(); }));
    answerMinute.addEventListener("change", checkTime);
    
    generateNewTime();
}

function initWordMagic() {
    const container = document.getElementById("word-magic-mode");
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-6">Магия Слов</h2>
        <p class="text-center text-gray-600 mb-8">Переведи словесное время в цифровое!</p>
        <div class="text-center">
            <div id="word-phrase" class="text-2xl font-bold text-purple-600 bg-purple-100 p-6 rounded-2xl mb-6"></div>
            <div class="flex justify-center items-center space-x-4 mb-6">
                <input type="number" id="word-hour" min="0" max="23" placeholder="ЧЧ" class="w-20 p-3 text-center border-2 rounded-lg touch-target">
                <span class="text-2xl font-bold">:</span>
                <input type="number" id="word-minute" min="0" max="59" placeholder="ММ" class="w-20 p-3 text-center border-2 rounded-lg touch-target">
            </div>
            <button id="check-word-time" class="bg-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Проверить</button>
            <div id="word-feedback" class="mt-4 text-xl font-bold h-6"></div>
            <div class="mt-6">
                <div id="word-score" class="text-lg font-semibold text-green-600 mb-2">Правильных ответов: 0</div>
                <button id="next-word" class="bg-blue-500 text-white font-bold py-2 px-6 rounded-full touch-target">Следующая фраза</button>
            </div>
        </div>`;
    
    const phraseEl = container.querySelector("#word-phrase");
    const hourInput = container.querySelector("#word-hour");
    const minuteInput = container.querySelector("#word-minute");
    const checkBtn = container.querySelector("#check-word-time");
    const feedback = container.querySelector("#word-feedback");
    const scoreEl = container.querySelector("#word-score");
    const nextBtn = container.querySelector("#next-word");
    
    let currentAnswer = "";
    let score = 0;
    
    function generateNewPhrase() {
        const randomPhrase = wordMagicData[Math.floor(Math.random() * wordMagicData.length)];
        
        phraseEl.textContent = randomPhrase.phrase;
        currentAnswer = randomPhrase.answer;
        
        hourInput.value = "";
        minuteInput.value = "";
        feedback.textContent = "";
        hourInput.focus();
    }
    
    function checkWordTime() {
        const userHour = hourInput.value.padStart(2, '0');
        const userMinute = minuteInput.value.padStart(2, '0');
        const userTime = `${userHour}:${userMinute}`;
        
        if (userTime === currentAnswer) {
            score++;
            scoreEl.textContent = `Правильных ответов: ${score}`;
            feedback.textContent = "Отлично! 🎉";
            feedback.className = "mt-4 text-xl font-bold h-6 text-green-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        } else {
            feedback.textContent = `Неверно. Правильное время: ${currentAnswer}`;
            feedback.className = "mt-4 text-xl font-bold h-6 text-red-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        }
    }
    
    checkBtn.onclick = checkWordTime;
    nextBtn.onclick = generateNewPhrase;
    
    hourInput.addEventListener("keypress", (e => { if (e.key === "Enter") minuteInput.focus(); }));
    minuteInput.addEventListener("keypress", (e => { if (e.key === "Enter") checkWordTime(); }));
    
    generateNewPhrase();
}

function initSeasons() {
    const container = document.getElementById("seasons-mode");
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-6">Времена Года и Месяцы</h2>
        <div class="season-wheel mx-auto mb-8 relative">
            ${seasonsData.map((month, index) => {
                const angle = (index * 30) - 90;
                const x = 50 + 40 * Math.cos(angle * Math.PI / 180);
                const y = 50 + 40 * Math.sin(angle * Math.PI / 180);
                
                return `
                    <div class="month ${month.bg} touch-target" 
                         style="left: ${x}%; top: ${y}%; background-color: ${month.color}; color: white;"
                         data-month="${month.name}"
                         data-season="${month.season}"
                         data-num="${month.num}">
                        <div class="text-lg">${month.icon}</div>
                        <div class="text-xs font-bold">${month.name}</div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="text-center mb-6">
            <div id="season-info" class="text-xl font-bold text-gray-600 mb-4">Выбери месяц, чтобы узнать время года!</div>
            <div id="season-rhyme" class="text-lg text-purple-600 italic"></div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            ${['Зима', 'Весна', 'Лето', 'Осень'].map(season => `
                <div class="season-filter bg-gray-200 hover:bg-gray-300 p-3 rounded-lg text-center font-bold cursor-pointer touch-target" data-season="${season}">
                    ${season}
                </div>
            `).join('')}
        </div>
        
        <div class="text-center">
            <button id="season-quiz" class="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Начать викторину</button>
        </div>`;
    
    const infoEl = container.querySelector("#season-info");
    const rhymeEl = container.querySelector("#season-rhyme");
    const months = container.querySelectorAll(".month");
    const seasonFilters = container.querySelectorAll(".season-filter");
    const quizBtn = container.querySelector("#season-quiz");
    
    // Обработчики для месяцев
    months.forEach(month => {
        month.addEventListener('click', () => {
            const monthName = month.dataset.month;
            const season = month.dataset.season;
            
            // Вибрация при нажатии
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Сброс выделения
            months.forEach(m => m.style.transform = 'scale(1)');
            
            // Выделение выбранного месяца
            month.style.transform = 'scale(1.2)';
            
            infoEl.textContent = `${monthName} — это ${season}`;
            rhymeEl.textContent = seasonRhymes[season];
        });
    });
    
    // Обработчики для фильтров времен года
    seasonFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedSeason = filter.dataset.season;
            
            // Вибрация при нажатии
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            // Сброс выделения
            seasonFilters.forEach(f => {
                f.classList.remove('bg-blue-500', 'text-white');
                f.classList.add('bg-gray-200');
            });
            
            // Выделение выбранного фильтра
            filter.classList.remove('bg-gray-200');
            filter.classList.add('bg-blue-500', 'text-white');
            
            // Выделение соответствующих месяцев
            months.forEach(month => {
                if (month.dataset.season === selectedSeason) {
                    month.style.transform = 'scale(1.1)';
                    month.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
                } else {
                    month.style.transform = 'scale(0.8)';
                    month.style.boxShadow = 'none';
                    month.style.opacity = '0.5';
                }
            });
            
            infoEl.textContent = `Месяцы времени года: ${selectedSeason}`;
            rhymeEl.textContent = seasonRhymes[selectedSeason];
        });
    });
    
    // Квиз по временам года
    quizBtn.onclick = () => startSeasonQuiz(container);
}

function startSeasonQuiz(container) {
    let currentQuestion = 0;
    let score = 0;
    const totalQuestions = 8;
    
    function showSeasonQuestion() {
        if (currentQuestion >= totalQuestions) {
            showSeasonResults();
            return;
        }
        
        const randomMonth = seasonsData[Math.floor(Math.random() * seasonsData.length)];
        const wrongSeasons = ['Зима', 'Весна', 'Лето', 'Осень']
            .filter(season => season !== randomMonth.season);
        const allSeasons = [randomMonth.season, ...wrongSeasons.slice(0, 3)]
            .sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <h2 class="text-3xl font-bold text-center mb-6">Викторина: Времена года</h2>
            <div class="text-center">
                <div class="text-lg mb-4">Вопрос ${currentQuestion + 1} из ${totalQuestions}</div>
                <div class="text-8xl mb-4">${randomMonth.icon}</div>
                <div class="text-3xl font-bold mb-6">${randomMonth.name}</div>
                <p class="text-xl font-semibold mb-6">К какому времени года относится этот месяц?</p>
                <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    ${allSeasons.map(season => `
                        <button class="season-quiz-answer bg-blue-200 hover:bg-blue-300 p-4 rounded-lg font-bold touch-target" data-answer="${season}">${season}</button>
                    `).join('')}
                </div>
                <div id="season-quiz-feedback" class="mt-4 text-xl font-bold h-6"></div>
            </div>`;
        
        container.querySelectorAll('.season-quiz-answer').forEach(btn => {
            btn.onclick = () => checkSeasonAnswer(btn.dataset.answer, randomMonth.season);
        });
    }
    
    function checkSeasonAnswer(selected, correct) {
        const feedback = container.querySelector('#season-quiz-feedback');
        const isCorrect = selected === correct;
        
        if (isCorrect) {
            score++;
            feedback.textContent = "Правильно! ✓";
            feedback.className = "mt-4 text-xl font-bold h-6 text-green-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else {
            feedback.textContent = `Неверно. Правильный ответ: ${correct}`;
            feedback.className = "mt-4 text-xl font-bold h-6 text-red-500";
            
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }
        
        container.querySelectorAll('.season-quiz-answer').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === correct) {
                btn.classList.add('bg-green-500', 'text-white');
            } else if (btn.dataset.answer === selected && !isCorrect) {
                btn.classList.add('bg-red-500', 'text-white');
            }
        });
        
        currentQuestion++;
        setTimeout(showSeasonQuestion, 2000);
    }
    
    function showSeasonResults() {
        const percentage = Math.round((score / totalQuestions) * 100);
        let message = "Попробуй еще раз!";
        let color = "text-red-500";
        
        if (percentage >= 75) {
            message = "Отлично! 🏆";
            color = "text-green-500";
        } else if (percentage >= 50) {
            message = "Хорошо! 👍";
            color = "text-blue-500";
        }
        
        container.innerHTML = `
            <h2 class="text-3xl font-bold text-center mb-6">Результаты викторины</h2>
            <div class="text-center bg-gray-100 p-8 rounded-2xl">
                <div class="text-6xl font-extrabold mb-4 ${color}">${percentage}%</div>
                <div class="text-2xl font-bold mb-4 ${color}">${message}</div>
                <div class="text-lg mb-6">Правильных ответов: ${score} из ${totalQuestions}</div>
                <button onclick="startMode('seasons')" class="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Начать заново</button>
            </div>`;
        
        if (navigator.vibrate) {
            if (percentage >= 75) {
                navigator.vibrate([100, 50, 100, 50, 100]);
            } else {
                navigator.vibrate(200);
            }
        }
    }
    
    showSeasonQuestion();
}

// Экспорт функций для использования в основном файле
window.timeModes = {
    initInteractiveClock,
    initTimeOfDay,
    initWhatTime,
    initWordMagic,
    initSeasons
};
