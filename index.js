// Quiz data array required by the assignment
// At least 5 question objects; each has question, answer, and options
var questionsArr = [
  {
    question: "Who created JavaScript?",
    answer: "Brendan Eich",
    options: [
      "Linus Torvalds",
      "Brendan Eich",
      "Dan Abramov",
      "Douglas Crockford"
    ]
  },
  {
    question: "In what year was JavaScript created?",
    answer: "1995",
    options: [
      "1999",
      "1975",
      "1995",
      "2005"
    ]
  },
  {
    question: "Which method repeatedly runs a function on a time interval?",
    answer: "setInterval",
    options: [
      "setTimeout",
      "setInterval",
      "setTimer",
      "runLoop"
    ]
  },
  {
    question: "Which method stops an interval timer?",
    answer: "clearInterval",
    options: [
      "stopInterval",
      "clearInterval",
      "cancelTimeout",
      "pauseTimer"
    ]
  },
  {
    question: "What does localStorage do?",
    answer: "Stores data in the browser",
    options: [
      "Stores data on the server",
      "Deletes cookies",
      "Stores data in the browser",
      "Resets the page"
    ]
  }
];

// Get the quiz container div
var quizDiv = document.getElementById("quiz");

// Game state variables
var currentQuestionIndex = 0;
var correctAnswers = 0;
var timeRemaining = 30;
var timerId = null;

// Key used for localStorage
var PREVIOUS_SCORE_KEY = "previous-score";

// Renders the start screen
// - If previous score exists: show "Previous Score: XX%"
// - Always show Start Quiz button with id="start-quiz"
function renderStartScreen() {
  // Clear any existing content
  quizDiv.innerHTML = "";

  // Check localStorage for previous score
  var savedScore = localStorage.getItem(PREVIOUS_SCORE_KEY);
  if (savedScore !== null) {
    var scoreParagraph = document.createElement("p");
    scoreParagraph.textContent = "Previous Score: " + savedScore + "%";
    quizDiv.appendChild(scoreParagraph);
  }

  // Create Start Quiz button
  var startButton = document.createElement("button");
  startButton.id = "start-quiz";
  startButton.textContent = "Start Quiz!";
  startButton.addEventListener("click", startQuiz);

  quizDiv.appendChild(startButton);
}

// Starts a new quiz game
function startQuiz() {
  // Reset state
  currentQuestionIndex = 0;
  correctAnswers = 0;
  timeRemaining = 30;

  // Show the first question
  showQuestion();
}

// Displays the current question, answer options, and timer
function showQuestion() {
  // If we're out of questions, end the game
  if (currentQuestionIndex >= questionsArr.length) {
    endGame();
    return;
  }

  // Reset timer to 30 seconds for this question
  timeRemaining = 30;

  var currentQuestion = questionsArr[currentQuestionIndex];

  // Clear quiz div and build new structure:
  // <p>Question</p>
  // <div>buttons...</div>
  // <p>timeRemaining</p>
  quizDiv.innerHTML = "";

  // Question text
  var questionP = document.createElement("p");
  questionP.textContent = currentQuestion.question;
  quizDiv.appendChild(questionP);

  // Choices container
  var choicesDiv = document.createElement("div");

  currentQuestion.options.forEach(function (optionText) {
    var optionButton = document.createElement("button");
    optionButton.textContent = optionText;
    optionButton.addEventListener("click", function () {
      handleAnswer(optionText);
    });
    choicesDiv.appendChild(optionButton);
  });

  quizDiv.appendChild(choicesDiv);

  // Timer display
  var timerP = document.createElement("p");
  timerP.textContent = timeRemaining;
  quizDiv.appendChild(timerP);

  // Start the 30-second countdown
  startTimer(timerP);
}

// Starts the per-question timer using setInterval
function startTimer(timerElement) {
  // Clear any previous timer just in case
  if (timerId !== null) {
    clearInterval(timerId);
  }

  timerElement.textContent = timeRemaining;

  timerId = setInterval(function () {
    timeRemaining--;
    timerElement.textContent = timeRemaining;

    // If time runs out, move immediately to next question
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      timerId = null;

      // Go to next question (no feedback message)
      currentQuestionIndex++;
      showQuestion();
    }
  }, 1000); // 1000 ms = 1 second
}

// Handles a user clicking an answer choice
function handleAnswer(selectedOption) {
  // Stop the timer for this question
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  var currentQuestion = questionsArr[currentQuestionIndex];

  // Check if answer is correct
  if (selectedOption === currentQuestion.answer) {
    correctAnswers++;
  }

  // Move to the next question (no messaging/feedback)
  currentQuestionIndex++;
  showQuestion();
}

// Ends the game, calculates score, saves to localStorage, and shows start screen
function endGame() {
  // Ensure timer is stopped
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  var totalQuestions = questionsArr.length;
  var percentScore = 0;

  if (totalQuestions > 0) {
    percentScore = Math.round((correctAnswers / totalQuestions) * 100);
  }

  // Save most recent score in localStorage under "previous-score"
  localStorage.setItem(PREVIOUS_SCORE_KEY, String(percentScore));

  // Show start screen again, which will now include the previous score
  renderStartScreen();
}

// Initialize the app on page load
renderStartScreen();
