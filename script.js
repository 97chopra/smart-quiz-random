const questionBank = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Paris", "Madrid", "Rome"],
        correct: "Paris",
        hint: "It is called the City of Light."
    },
    {
        question: "How many continents are there in the world?",
        answers: ["5", "6", "7", "8"],
        correct: "7",
        hint: "It is more than 6."
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Mars", "Venus", "Jupiter", "Mercury"],
        correct: "Mars",
        hint: "It is the fourth planet from the Sun."
    },
    {
        question: "What is 9 + 6?",
        answers: ["13", "14", "15", "16"],
        correct: "15",
        hint: "It is between 14 and 16."
    },
    {
        question: "Which animal is called the King of the Jungle?",
        answers: ["Tiger", "Lion", "Elephant", "Bear"],
        correct: "Lion",
        hint: "It has a mane."
    },
    {
        question: "What is the largest ocean in the world?",
        answers: ["Indian Ocean", "Atlantic Ocean", "Pacific Ocean", "Arctic Ocean"],
        correct: "Pacific Ocean",
        hint: "It is the biggest ocean on Earth."
    },
    {
        question: "How many days are there in a week?",
        answers: ["5", "6", "7", "8"],
        correct: "7",
        hint: "It is one more than 6."
    },
    {
        question: "Which country is famous for the pyramids?",
        answers: ["India", "Egypt", "China", "Mexico"],
        correct: "Egypt",
        hint: "It is in Africa."
    },
    {
        question: "What is 12 x 2?",
        answers: ["22", "24", "26", "28"],
        correct: "24",
        hint: "It is double of 12."
    },
    {
        question: "Which is the largest mammal in the world?",
        answers: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
        correct: "Blue Whale",
        hint: "It lives in the ocean."
    },
    {
        question: "What is the capital of Japan?",
        answers: ["Seoul", "Tokyo", "Bangkok", "Beijing"],
        correct: "Tokyo",
        hint: "It is a famous city in Asia."
    },
    {
        question: "How many legs does a spider have?",
        answers: ["6", "8", "10", "12"],
        correct: "8",
        hint: "It is more than an insect."
    },
    {
        question: "What is 7 x 8?",
        answers: ["54", "56", "58", "64"],
        correct: "56",
        hint: "It is greater than 55."
    },
    {
        question: "Which gas do plants use from the air?",
        answers: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
        correct: "Carbon Dioxide",
        hint: "Humans breathe this out."
    },
    {
        question: "Which country is known for the Great Wall?",
        answers: ["India", "China", "Egypt", "Italy"],
        correct: "China",
        hint: "It is in East Asia."
    },
    {
        question: "How many hours are there in a day?",
        answers: ["12", "18", "24", "36"],
        correct: "24",
        hint: "One full day and night."
    },
    {
        question: "Which bird is a symbol of peace?",
        answers: ["Crow", "Dove", "Eagle", "Parrot"],
        correct: "Dove",
        hint: "It is often shown in white."
    },
    {
        question: "What is the boiling point of water in Celsius?",
        answers: ["50", "75", "100", "120"],
        correct: "100",
        hint: "It is a 3-digit number."
    },
    {
        question: "Which desert is the largest hot desert in the world?",
        answers: ["Gobi", "Kalahari", "Sahara", "Arabian"],
        correct: "Sahara",
        hint: "It is in Africa."
    },
    {
        question: "How many months are there in a year?",
        answers: ["10", "11", "12", "13"],
        correct: "12",
        hint: "Same number as on a clock."
    }
];

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let answered = false;

function shuffleArray(array) {
    let newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}

function generateNewQuiz() {
    let shuffledQuestions = shuffleArray(questionBank);

    questions = shuffledQuestions.slice(0, 10).map(questionItem => {
        return {
            question: questionItem.question,
            answers: shuffleArray(questionItem.answers),
            correct: questionItem.correct,
            hint: questionItem.hint
        };
    });
}

function loadQuestion() {
    answered = false;
    document.getElementById("result").innerText = "";
    document.getElementById("hint-text").innerText = "";

    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question").innerText = currentQuestion.question;

    const answerButtons = document.getElementById("answer-buttons");
    answerButtons.innerHTML = "";

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.classList.add("btn");

        button.onclick = function () {
            checkAnswer(answer, button);
        };

        answerButtons.appendChild(button);
    });

    updateTopBar();
}

function checkAnswer(selectedAnswer, clickedButton) {
    if (answered) {
        return;
    }

    answered = true;
    const currentQuestion = questions[currentQuestionIndex];
    const allButtons = document.querySelectorAll(".btn");

    allButtons.forEach(button => {
        button.disabled = true;

        if (button.innerText === currentQuestion.correct) {
            button.classList.add("correct-answer");
        }
    });

    if (selectedAnswer === currentQuestion.correct) {
        score++;
        document.getElementById("result").innerText = "Correct!";
    } else {
        lives--;
        clickedButton.classList.add("wrong-answer");
        document.getElementById("result").innerText =
            "Wrong! Correct answer: " + currentQuestion.correct;
    }

    updateTopBar();
    saveProgress();

    if (lives === 0) {
        endGame("Game Over!");
    }
}

function showHint() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("hint-text").innerText = "Hint: " + currentQuestion.hint;
}

function nextQuestion() {
    if (!answered) {
        document.getElementById("result").innerText = "Please answer the question first.";
        return;
    }

    if (lives === 0) {
        return;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        saveProgress();
        loadQuestion();
    } else {
        endGame("Quiz Finished!");
    }
}

function quitGame() {
    const quitData = {
        currentQuestionIndex: currentQuestionIndex,
        score: score,
        lives: lives,
        questions: questions,
        timestamp: new Date().getTime()
    };

    localStorage.setItem("quizProgress", JSON.stringify(quitData));

    document.querySelector(".quiz-container").innerHTML = `
        <h1>You quit the game</h1>
        <h2>Your progress has been saved for 24 hours.</h2>
        <p>Come back within 24 hours to continue.</p>
        <button class="final-btn" onclick="location.reload()">Reload</button>
    `;
}

function saveProgress() {
    const progressData = {
        currentQuestionIndex: currentQuestionIndex,
        score: score,
        lives: lives,
        questions: questions,
        timestamp: new Date().getTime()
    };

    localStorage.setItem("quizProgress", JSON.stringify(progressData));
}

function loadSavedProgress() {
    const savedData = localStorage.getItem("quizProgress");

    if (savedData) {
        const progress = JSON.parse(savedData);
        const now = new Date().getTime();
        const hours24 = 24 * 60 * 60 * 1000;

        if (now - progress.timestamp <= hours24) {
            const resume = confirm("You have a saved game from the last 24 hours. Do you want to continue?");
            if (resume) {
                currentQuestionIndex = progress.currentQuestionIndex;
                score = progress.score;
                lives = progress.lives;
                questions = progress.questions;
                return;
            } else {
                localStorage.removeItem("quizProgress");
            }
        } else {
            localStorage.removeItem("quizProgress");
        }
    }

    generateNewQuiz();
}

function restartGame() {
    localStorage.removeItem("quizProgress");
    currentQuestionIndex = 0;
    score = 0;
    lives = 3;
    generateNewQuiz();
    loadQuestion();
}

function updateTopBar() {
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("lives").innerText = "Lives: " + lives;
}

function endGame(message) {
    localStorage.removeItem("quizProgress");

    document.querySelector(".quiz-container").innerHTML = `
        <h1>${message}</h1>
        <h2>Final Score: ${score} / ${questions.length}</h2>
        <p>Lives left: ${lives}</p>
        <button class="final-btn" onclick="restartGameFromEnd()">Play Again</button>
    `;
}

function restartGameFromEnd() {
    document.body.innerHTML = `
        <div class="quiz-container">
            <h1>Random Smart Quiz Game</h1>

            <div class="top-bar">
                <p id="score">Score: 0</p>
                <p id="lives">Lives: 3</p>
            </div>

            <h2 id="question">Question appears here</h2>

            <div id="answer-buttons" class="btn-container"></div>

            <p id="hint-text"></p>
            <p id="result"></p>

            <div class="controls">
                <button onclick="showHint()">Hint</button>
                <button onclick="nextQuestion()">Next</button>
                <button onclick="quitGame()">Quit</button>
                <button onclick="restartGame()">Restart</button>
            </div>
        </div>
    `;

    currentQuestionIndex = 0;
    score = 0;
    lives = 3;
    generateNewQuiz();
    loadQuestion();
}

loadSavedProgress();
loadQuestion();