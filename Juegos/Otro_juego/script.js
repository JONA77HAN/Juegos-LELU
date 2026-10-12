
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let publicQuizzes = JSON.parse(localStorage.getItem('publicQuizzes')) || [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let editingQuizIndex = null;
let activeSource = 'my'; // 'my' o 'public'

const screens = {
    home: document.getElementById('home-screen'),
    editor: document.getElementById('editor-screen'),
    play: document.getElementById('play-screen')
};

const btnGoCreate = document.getElementById('btn-go-create');
const quizList = document.getElementById('quiz-list');
const publicQuizList = document.getElementById('public-quiz-list');
const editorTitle = document.getElementById('editor-title');
const quizTitleInput = document.getElementById('quiz-title');
const questionsContainer = document.getElementById('questions-container');
const btnAddQuestion = document.getElementById('btn-add-question');
const btnSaveQuiz = document.getElementById('btn-save-quiz');
const btnCancelEditor = document.getElementById('btn-cancel-editor');

const playQuizTitle = document.getElementById('play-quiz-title');
const questionProgress = document.getElementById('question-progress');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizCard = document.getElementById('quiz-card');
const resultsContainer = document.getElementById('results-container');
const scoreText = document.getElementById('score-text');
const btnBackHome = document.getElementById('btn-back-home');
const btnQuitPlay = document.getElementById('btn-quit-play');

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Cambiar entre pestañas en el inicio
window.switchTab = function(tab) {
    activeSource = tab;
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));

    const mySection = document.getElementById('my-quizzes-section');
    const publicSection = document.getElementById('public-quizzes-section');

    if (tab === 'my') {
        tabs[0].classList.add('active');
        mySection.classList.remove('hidden');
        publicSection.classList.add('hidden');
    } else {
        tabs[1].classList.add('active');
        mySection.classList.add('hidden');
        publicSection.classList.remove('hidden');
        renderPublicQuizList();
    }
}

function renderQuizLists() {
    renderMyQuizList();
    renderPublicQuizList();
}

function renderMyQuizList() {
    quizList.innerHTML = '';
    if (quizzes.length === 0) {
        quizList.innerHTML = '<p style="text-align: center; color: #6b7280;">No tienes cuestionarios guardados. ¡Crea uno nuevo!</p>';
        return;
    }

    quizzes.forEach((quiz, index) => {
        const item = document.createElement('div');
        item.className = 'quiz-item';
        item.innerHTML = `
            <div>
                <h3>${quiz.title}</h3>
                <small>${quiz.questions.length} pregunta(s)</small>
            </div>
            <div class="quiz-buttons">
                <button type="button" class="btn primary" onclick="startQuiz(${index}, 'my')">Jugar</button>
                <button type="button" class="btn publish" onclick="publishQuiz(${index})">Publicar</button>
                <button type="button" class="btn warning" onclick="editQuiz(${index})">Editar</button>
                <button type="button" class="btn danger" onclick="deleteQuiz(${index})">Eliminar</button>
            </div>
        `;
        quizList.appendChild(item);
    });
}

function renderPublicQuizList() {
    publicQuizList.innerHTML = '';
    if (publicQuizzes.length === 0) {
        publicQuizList.innerHTML = '<p style="text-align: center; color: #6b7280;">No hay cuestionarios públicos todavía. ¡Publica el tuyo!</p>';
        return;
    }

    publicQuizzes.forEach((quiz, index) => {
        const item = document.createElement('div');
        item.className = 'quiz-item';
        item.innerHTML = `
            <div>
                <h3>${quiz.title}</h3>
                <small>${quiz.questions.length} pregunta(s)</small>
            </div>
            <div class="quiz-buttons">
                <button type="button" class="btn primary" onclick="startQuiz(${index}, 'public')">Jugar</button>
            </div>
        `;
        publicQuizList.appendChild(item);
    });
}

// Publicar un cuestionario
window.publishQuiz = function(index) {
    const quizToPublish = quizzes[index];
    // Evitar duplicados exactos si ya está publicado
    const exists = publicQuizzes.some(q => q.title === quizToPublish.title && q.questions.length === quizToPublish.questions.length);
    
    if (exists) {
        alert('Este cuestionario ya ha sido publicado anteriormente.');
        return;
    }

    publicQuizzes.push(JSON.parse(JSON.stringify(quizToPublish)));
    localStorage.setItem('publicQuizzes', JSON.stringify(publicQuizzes));
    alert('¡Cuestionario publicado con éxito! Ya aparece en la pestaña de Cuestionarios Públicos.');
    renderPublicQuizList();
}

btnGoCreate.addEventListener('click', () => {
    editingQuizIndex = null;
    editorTitle.textContent = "✏️ Crear Cuestionario";
    quizTitleInput.value = '';
    questionsContainer.innerHTML = '';
    addQuestionBlock();
    showScreen('editor');
});

window.editQuiz = function(index) {
    editingQuizIndex = index;
    editorTitle.textContent = "✏️ Editar Cuestionario";
    const quiz = quizzes[index];
    quizTitleInput.value = quiz.title;
    questionsContainer.innerHTML = '';

    quiz.questions.forEach(q => {
        addQuestionBlock(q);
    });

    showScreen('editor');
};

btnCancelEditor.addEventListener('click', () => {
    showScreen('home');
});

btnAddQuestion.addEventListener('click', () => {
    addQuestionBlock();
});

function addQuestionBlock(qData = null) {
    const block = document.createElement('div');
    block.className = 'question-block';
    
    const textVal = qData ? qData.text : '';
    const opts = qData ? qData.options : ['', '', '', ''];
    const correctVal = qData ? qData.correct : 0;
    const groupName = 'radio_' + Math.random().toString(36).substr(2, 9);

    block.innerHTML = `
        <div class="form-group">
            <label>Pregunta:</label>
            <input type="text" class="q-text" placeholder="Escribe la pregunta aquí..." value="${textVal}">
        </div>
        <div class="form-group">
            <label>Opciones (Escribe el texto y marca el círculo de la correcta):</label>
            <div class="options-inputs-list">
                <div class="option-row">
                    <input type="radio" name="${groupName}" value="0" ${correctVal === 0 ? 'checked' : ''}>
                    <input type="text" class="opt-text" placeholder="Opción 1" value="${opts[0] || ''}">
                </div>
                <div class="option-row">
                    <input type="radio" name="${groupName}" value="1" ${correctVal === 1 ? 'checked' : ''}>
                    <input type="text" class="opt-text" placeholder="Opción 2" value="${opts[1] || ''}">
                </div>
                <div class="option-row">
                    <input type="radio" name="${groupName}" value="2" ${correctVal === 2 ? 'checked' : ''}>
                    <input type="text" class="opt-text" placeholder="Opción 3" value="${opts[2] || ''}">
                </div>
                <div class="option-row">
                    <input type="radio" name="${groupName}" value="3" ${correctVal === 3 ? 'checked' : ''}>
                    <input type="text" class="opt-text" placeholder="Opción 4" value="${opts[3] || ''}">
                </div>
            </div>
        </div>
        <button type="button" class="btn danger btn-del-q" style="padding: 5px 10px; font-size: 0.8rem;">Eliminar Pregunta</button>
    `;

    block.querySelector('.btn-del-q').addEventListener('click', () => {
        if (questionsContainer.children.length <= 1) {
            alert('El cuestionario debe tener al menos una pregunta.');
            return;
        }
        block.remove();
    });

    questionsContainer.appendChild(block);
}

btnSaveQuiz.addEventListener('click', () => {
    const title = quizTitleInput.value.trim();
    if (!title) {
        alert('Ingresa un título para el cuestionario.');
        return;
    }

    const blocks = questionsContainer.querySelectorAll('.question-block');
    if (blocks.length === 0) {
        alert('Agrega al menos una pregunta.');
        return;
    }

    const questions = [];

    for (let block of blocks) {
        const text = block.querySelector('.q-text').value.trim();
        if (!text) {
            alert('Todas las preguntas deben tener texto.');
            return;
        }

        const optInputs = block.querySelectorAll('.opt-text');
        const radios = block.querySelectorAll('input[type="radio"]');
        const options = [];
        let correctIndex = 0;

        optInputs.forEach((input, idx) => {
            const val = input.value.trim();
            if (!val) {
                alert('Por favor, completa todas las opciones de texto.');
                throw new Error('Incompleto');
            }
            options.push(val);
            if (radios[idx].checked) {
                correctIndex = idx;
            }
        });

        questions.push({ text, options, correct: correctIndex });
    }

    const quizData = { title, questions };

    if (editingQuizIndex !== null) {
        quizzes[editingQuizIndex] = quizData;
    } else {
        quizzes.push(quizData);
    }

    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    renderQuizLists();
    showScreen('home');
});

window.deleteQuiz = function(index) {
    if (confirm('¿Estás seguro de eliminar este cuestionario?')) {
        quizzes.splice(index, 1);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        renderQuizLists();
    }
};

window.startQuiz = function(index, source = 'my') {
    currentQuiz = source === 'my' ? quizzes[index] : publicQuizzes[index];
    currentQuestionIndex = 0;
    score = 0;

    playQuizTitle.textContent = currentQuiz.title;
    quizCard.classList.remove('hidden');
    resultsContainer.classList.add('hidden');

    showScreen('play');
    loadQuestion();
};

function loadQuestion() {
    const q = currentQuiz.questions[currentQuestionIndex];
    questionProgress.textContent = `Pregunta ${currentQuestionIndex + 1} de ${currentQuiz.questions.length}`;
    questionText.textContent = q.text;
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectAnswer(index, btn, q.correct));
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex, btn, correctIndex) {
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(b => b.disabled = true);

    if (selectedIndex === correctIndex) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('incorrect');
        allButtons[correctIndex].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuiz.questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1200);
}

function showResults() {
    quizCard.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    scoreText.textContent = `Tu puntaje: ${score} de ${currentQuiz.questions.length}`;
}

btnBackHome.addEventListener('click', () => showScreen('home'));
btnQuitPlay.addEventListener('click', () => showScreen('home'));

renderQuizLists();