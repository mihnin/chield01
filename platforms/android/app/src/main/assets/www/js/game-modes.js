// Дополнительные режимы игры для Супер-тренажера

// Продолжение режимов из app.js

function initVisualizerMode() {
    const container = document.getElementById("visualizer-mode");
    const maxNum = state.isPremium ? 10 : 3;
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-4">Визуализатор</h2>
        ${!state.isPremium ? `
        <div class="bg-amber-100 border-2 border-amber-300 p-4 rounded-xl mb-6 premium-banner">
            <p class="text-center text-amber-800 mb-2"><strong>Бесплатная версия:</strong> Доступны числа только до 3!</p>
            <div class="text-center">
                <button onclick="purchasePremium()" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold">
                    <span class="premium-badge">PRO</span> Разблокировать полную версию
                </button>
            </div>
        </div>` : ''}
        <div class="flex justify-center items-center space-x-4 mb-6">
            <input type="number" id="v-num1" min="1" max="${maxNum}" value="${Math.min(3, maxNum)}" class="w-28 p-3 text-2xl text-center border-2 rounded-lg touch-target">
            <span class="text-2xl font-bold">×</span>
            <input type="number" id="v-num2" min="1" max="${maxNum}" value="${Math.min(3, maxNum)}" class="w-28 p-3 text-2xl text-center border-2 rounded-lg touch-target">
        </div>
        <div id="visualizer-grid" class="mx-auto border p-2" style="width:fit-content;display:grid;gap:4px"></div>
        <p id="visualizer-result" class="text-center text-2xl font-bold mt-4"></p>`;
        
    const vNum1 = container.querySelector("#v-num1");
    const vNum2 = container.querySelector("#v-num2");
    const grid = container.querySelector("#visualizer-grid");
    const result = container.querySelector("#visualizer-result");
    
    function update() {
        let num1 = parseInt(vNum1.value) || 1;
        let num2 = parseInt(vNum2.value) || 1;
        
        if (!state.isPremium) {
            if (num1 > maxNum) {
                num1 = maxNum;
                vNum1.value = maxNum;
            }
            if (num2 > maxNum) {
                num2 = maxNum;
                vNum2.value = maxNum;
            }
        }
        
        grid.innerHTML = "";
        grid.style.gridTemplateColumns = `repeat(${num2}, 30px)`;
        
        for (let i = 0; i < num1 * num2; i++) {
            const cell = document.createElement("div");
            cell.className = "w-[30px] h-[30px] bg-green-400 rounded";
            grid.appendChild(cell);
        }
        
        result.textContent = `${num1} × ${num2} = ${num1 * num2}`;
    }
    
    vNum1.oninput = update;
    vNum2.oninput = update;
    update();
}

function initPythagorasMode() {
    const container = document.getElementById("pythagoras-mode");
    const maxNum = state.isPremium ? 10 : 3;
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-2">Таблица Пифагора</h2>
        <p class="text-center text-gray-500 mb-4">Нажми на любое число, чтобы увидеть, как оно получается. <br> Ответ будет <span class="text-red-500 font-bold">на пересечении</span>!</p>
        ${!state.isPremium ? `
        <div class="bg-amber-100 border-2 border-amber-300 p-4 rounded-xl mb-6 premium-banner">
            <p class="text-center text-amber-800 mb-2"><strong>Бесплатная версия:</strong> Таблица Пифагора доступна только до 3!</p>
            <div class="text-center">
                <button onclick="purchasePremium()" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold">
                    <span class="premium-badge">PRO</span> Разблокировать полную версию
                </button>
            </div>
        </div>` : ''}
        <div class="overflow-x-auto">
            <table id="pythagoras-table" class="mx-auto" style="border-collapse:collapse"></table>
        </div>`;
        
    const table = container.querySelector("#pythagoras-table");
    const tbody = document.createElement("tbody");
    const header = document.createElement("tr");
    
    // Создаем пустую ячейку в левом верхнем углу
    const th_empty = document.createElement("th");
    th_empty.className = "w-12 h-12";
    header.appendChild(th_empty);
    
    // Создаем заголовок таблицы (горизонтальные числа)
    for (let i = 1; i <= 10; i++) {
        const th = document.createElement("th");
        th.textContent = i;
        th.dataset.col = i;
        
        if (i > maxNum && !state.isPremium) {
            th.className = "w-12 h-12 text-center border font-bold bg-gray-300 text-gray-500";
            th.dataset.premium = "true";
        } else {
            th.className = "w-12 h-12 text-center border font-bold cursor-pointer bg-gray-100 touch-target";
        }
        
        header.appendChild(th);
    }
    tbody.appendChild(header);
    
    // Создаем строки таблицы
    for (let i = 1; i <= 10; i++) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        
        th.textContent = i;
        th.dataset.row = i;
        
        if (i > maxNum && !state.isPremium) {
            th.className = "w-12 h-12 text-center border font-bold bg-gray-300 text-gray-500";
            th.dataset.premium = "true";
        } else {
            th.className = "w-12 h-12 text-center border font-bold cursor-pointer bg-gray-100 touch-target";
        }
        
        tr.appendChild(th);
        
        // Создаем ячейки со значениями
        for (let j = 1; j <= 10; j++) {
            const td = document.createElement("td");
            td.textContent = j * i;
            td.dataset.row = i;
            td.dataset.col = j;
            
            if ((i > maxNum || j > maxNum) && !state.isPremium) {
                td.className = "w-12 h-12 text-center border bg-gray-300 text-gray-500";
                td.dataset.premium = "true";
            } else {
                td.className = "w-12 h-12 text-center border font-bold cursor-pointer touch-target";
            }
            
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    
    // Обработчик нажатий на ячейки
    table.addEventListener("click", (e => {
        const target = e.target;
        
        if (target.dataset.premium === "true" && !state.isPremium) {
            purchasePremium();
            return;
        }
        
        if ("TD" !== target.tagName) return;
        
        // Вибрация при нажатии
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        
        table.querySelectorAll("td, th").forEach((e => {
            e.style.backgroundColor = "";
            e.style.color = "";
        }));
        
        const row = target.dataset.row;
        const col = target.dataset.col;
        
        table.querySelectorAll(`[data-row="${row}"]`).forEach((e => e.style.backgroundColor = "#93c5fd"));
        table.querySelectorAll(`[data-col="${col}"]`).forEach((e => e.style.backgroundColor = "#93c5fd"));
        
        target.style.backgroundColor = "#ef4444";
        target.style.color = "white";
    }));
}

function initFactorsMode() {
    const container = document.getElementById("factors-mode");
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-4">Найди множители</h2>
        <div class="text-center bg-orange-100 p-8 rounded-2xl">
            <p id="factors-question" class="text-8xl font-extrabold text-orange-600 mb-6"></p>
            <div class="flex justify-center items-center space-x-4 mb-4">
                <input type="number" id="factor-1" class="w-28 p-3 text-3xl text-center border-4 rounded-lg touch-target">
                <span class="text-3xl font-bold">×</span>
                <input type="number" id="factor-2" class="w-28 p-3 text-3xl text-center border-4 rounded-lg touch-target">
            </div>
            <button id="check-factors-btn" class="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Проверить</button>
            <div id="factors-feedback" class="mt-4 text-2xl font-bold h-8"></div>
        </div>`;
        
    const qEl = container.querySelector("#factors-question");
    const f1El = container.querySelector("#factor-1");
    const f2El = container.querySelector("#factor-2");
    const btn = container.querySelector("#check-factors-btn");
    const fbEl = container.querySelector("#factors-feedback");
    
    let product = 0;
    
    function nextQ() {
        const maxNum = state.isPremium ? 10 : 3;
        
        const num1 = Math.floor(maxNum * Math.random()) + 1;
        const num2 = Math.floor(maxNum * Math.random()) + 1;
        
        product = num1 * num2;
        qEl.textContent = product;
        f1El.value = "";
        f2El.value = "";
        fbEl.textContent = "";
        f1El.focus();
    }
    
    function check() {
        fbEl.classList.remove("text-green-500", "text-red-500");
        
        if (parseInt(f1El.value) * parseInt(f2El.value) === product) {
            fbEl.textContent = "Идеально! 🎉";
            fbEl.classList.add("text-green-500");
            
            // Вибрация при правильном ответе
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            setTimeout(nextQ, 1500);
        } else {
            fbEl.textContent = "Попробуй еще раз! 🤔";
            fbEl.classList.add("text-red-500");
            
            // Короткая вибрация при неправильном ответе
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        }
    }
    
    btn.onclick = check;
    f1El.addEventListener("keypress", (e => { if (e.key === "Enter") check(); }));
    f2El.addEventListener("keypress", (e => { if (e.key === "Enter") check(); }));
    
    nextQ();
}

function initSprintMode() {
    const container = document.getElementById("sprint-mode");
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-4">Спринт на время</h2>
        <div class="text-center">
            <div id="sprint-timer" class="text-6xl font-extrabold text-blue-600 mb-4">60</div>
            <div id="sprint-score" class="text-2xl font-bold text-green-600 mb-6">Правильных ответов: 0</div>
            <div id="sprint-question" class="text-5xl font-extrabold mb-4"></div>
            <input type="number" id="sprint-answer" class="w-40 p-4 text-3xl text-center border-4 rounded-lg mb-4 touch-target">
            <div class="flex justify-center gap-4">
                <button id="sprint-start" class="bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Начать</button>
                <button id="sprint-submit" class="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target hidden">Ответить</button>
            </div>
            <div id="sprint-feedback" class="mt-4 text-xl font-bold h-6"></div>
        </div>`;
    
    const timerEl = container.querySelector("#sprint-timer");
    const scoreEl = container.querySelector("#sprint-score");
    const questionEl = container.querySelector("#sprint-question");
    const answerEl = container.querySelector("#sprint-answer");
    const startBtn = container.querySelector("#sprint-start");
    const submitBtn = container.querySelector("#sprint-submit");
    const feedbackEl = container.querySelector("#sprint-feedback");
    
    let timeLeft = 60;
    let score = 0;
    let currentAnswer = 0;
    let isGameActive = false;
    
    function startSprint() {
        isGameActive = true;
        timeLeft = 60;
        score = 0;
        
        startBtn.classList.add("hidden");
        submitBtn.classList.remove("hidden");
        answerEl.disabled = false;
        answerEl.focus();
        
        nextQuestion();
        
        sprintState.timerId = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endSprint();
            }
        }, 1000);
    }
    
    function nextQuestion() {
        if (!isGameActive) return;
        
        const maxNum = state.isPremium ? 10 : 3;
        const num1 = Math.floor(maxNum * Math.random()) + 1;
        const num2 = Math.floor(maxNum * Math.random()) + 1;
        
        currentAnswer = num1 * num2;
        questionEl.textContent = `${num1} × ${num2} = ?`;
        answerEl.value = "";
        feedbackEl.textContent = "";
    }
    
    function checkAnswer() {
        if (!isGameActive) return;
        
        if (parseInt(answerEl.value) === currentAnswer) {
            score++;
            scoreEl.textContent = `Правильных ответов: ${score}`;
            feedbackEl.textContent = "Верно! ✓";
            feedbackEl.className = "mt-4 text-xl font-bold h-6 text-green-500";
            
            // Вибрация при правильном ответе
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            setTimeout(nextQuestion, 500);
        } else {
            feedbackEl.textContent = "Неверно! ✗";
            feedbackEl.className = "mt-4 text-xl font-bold h-6 text-red-500";
            
            // Вибрация при неправильном ответе
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }
    }
    
    function endSprint() {
        isGameActive = false;
        clearInterval(sprintState.timerId);
        
        answerEl.disabled = true;
        submitBtn.classList.add("hidden");
        startBtn.classList.remove("hidden");
        startBtn.textContent = "Играть еще раз";
        
        feedbackEl.textContent = `Игра окончена! Ваш результат: ${score} правильных ответов!`;
        feedbackEl.className = "mt-4 text-xl font-bold h-6 text-blue-600";
        
        // Длинная вибрация в конце игры
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }
    
    startBtn.onclick = startSprint;
    submitBtn.onclick = checkAnswer;
    answerEl.addEventListener("keypress", (e => { if (e.key === "Enter") checkAnswer(); }));
}

function initExamMode() {
    const container = document.getElementById("exam-mode");
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-center mb-4">Финальный Экзамен</h2>
        <div class="text-center">
            <div id="exam-progress" class="mb-4">
                <div class="bg-gray-200 rounded-full h-4 mb-2">
                    <div id="exam-progress-bar" class="bg-blue-600 h-4 rounded-full" style="width: 0%"></div>
                </div>
                <span id="exam-question-number">Вопрос 1 из 20</span>
            </div>
            <div id="exam-question" class="text-4xl font-extrabold mb-6"></div>
            <div id="exam-options" class="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6"></div>
            <div id="exam-feedback" class="text-xl font-bold h-6 mb-4"></div>
            <button id="exam-start" class="bg-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Начать экзамен</button>
        </div>`;
    
    const progressBar = container.querySelector("#exam-progress-bar");
    const questionNumber = container.querySelector("#exam-question-number");
    const questionEl = container.querySelector("#exam-question");
    const optionsEl = container.querySelector("#exam-options");
    const feedbackEl = container.querySelector("#exam-feedback");
    const startBtn = container.querySelector("#exam-start");
    
    let currentQuestion = 0;
    let correctAnswers = 0;
    let questions = [];
    
    function generateQuestions() {
        questions = [];
        const maxNum = state.isPremium ? 10 : 3;
        
        for (let i = 0; i < 20; i++) {
            const num1 = Math.floor(maxNum * Math.random()) + 1;
            const num2 = Math.floor(maxNum * Math.random()) + 1;
            const correct = num1 * num2;
            
            // Генерируем неправильные варианты
            const wrong1 = correct + Math.floor(Math.random() * 10) + 1;
            const wrong2 = correct - Math.floor(Math.random() * 10) - 1;
            const wrong3 = correct + Math.floor(Math.random() * 20) + 10;
            
            const options = [correct, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
            
            questions.push({
                question: `${num1} × ${num2}`,
                correct: correct,
                options: options
            });
        }
    }
    
    function startExam() {
        generateQuestions();
        currentQuestion = 0;
        correctAnswers = 0;
        
        startBtn.classList.add("hidden");
        showQuestion();
    }
    
    function showQuestion() {
        if (currentQuestion >= questions.length) {
            showResults();
            return;
        }
        
        const q = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        
        progressBar.style.width = `${progress}%`;
        questionNumber.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}`;
        questionEl.textContent = `${q.question} = ?`;
        
        optionsEl.innerHTML = q.options.map(option => 
            `<button class="exam-option bg-gray-200 hover:bg-gray-300 p-4 rounded-lg font-bold text-xl touch-target" data-answer="${option}">${option}</button>`
        ).join('');
        
        // Добавляем обработчики на варианты ответов
        optionsEl.querySelectorAll('.exam-option').forEach(btn => {
            btn.onclick = () => selectAnswer(parseInt(btn.dataset.answer));
        });
        
        feedbackEl.textContent = "";
    }
    
    function selectAnswer(answer) {
        const q = questions[currentQuestion];
        const isCorrect = answer === q.correct;
        
        if (isCorrect) {
            correctAnswers++;
            feedbackEl.textContent = "Правильно! ✓";
            feedbackEl.className = "text-xl font-bold h-6 mb-4 text-green-500";
            
            // Вибрация при правильном ответе
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else {
            feedbackEl.textContent = `Неверно. Правильный ответ: ${q.correct}`;
            feedbackEl.className = "text-xl font-bold h-6 mb-4 text-red-500";
            
            // Вибрация при неправильном ответе
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }
        
        // Отключаем все кнопки
        optionsEl.querySelectorAll('.exam-option').forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.answer) === q.correct) {
                btn.classList.add('bg-green-500', 'text-white');
            } else if (parseInt(btn.dataset.answer) === answer && !isCorrect) {
                btn.classList.add('bg-red-500', 'text-white');
            }
        });
        
        currentQuestion++;
        setTimeout(showQuestion, 2000);
    }
    
    function showResults() {
        const percentage = Math.round((correctAnswers / questions.length) * 100);
        let grade = "Попробуй еще раз";
        let color = "text-red-500";
        
        if (percentage >= 90) {
            grade = "Отлично! 🏆";
            color = "text-green-500";
        } else if (percentage >= 70) {
            grade = "Хорошо! 👍";
            color = "text-blue-500";
        } else if (percentage >= 50) {
            grade = "Неплохо 📚";
            color = "text-yellow-500";
        }
        
        container.innerHTML = `
            <h2 class="text-3xl font-bold text-center mb-4">Результаты экзамена</h2>
            <div class="text-center bg-gray-100 p-8 rounded-2xl">
                <div class="text-6xl font-extrabold mb-4 ${color}">${percentage}%</div>
                <div class="text-2xl font-bold mb-4 ${color}">${grade}</div>
                <div class="text-lg mb-6">Правильных ответов: ${correctAnswers} из ${questions.length}</div>
                <button onclick="startMode('exam')" class="bg-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg touch-target">Пройти еще раз</button>
            </div>`;
        
        // Особая вибрация для результатов
        if (navigator.vibrate) {
            if (percentage >= 90) {
                navigator.vibrate([100, 50, 100, 50, 100]);
            } else {
                navigator.vibrate(200);
            }
        }
    }
    
    startBtn.onclick = startExam;
}

// Экспорт функций для использования в основном файле
window.gameModes = {
    initVisualizerMode,
    initPythagorasMode,
    initFactorsMode,
    initSprintMode,
    initExamMode
};
