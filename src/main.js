import './style.css';
import { Questions } from '../questions'; 
const TIMEOUT = 4000;

const app = document.querySelector('#app');

const startButton = document.querySelector('#start');

startButton.addEventListener('click', startQuiz);

app.addEventListener('click', (e) => {
  console.log("App", e.currentTarget);
  
});

function startQuiz(even) {
  let currentQuestion = 0;
  let score = 0;

  
  displayQuestion(currentQuestion);

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length - 1, currentQuestion);
    app.appendChild(progress);
  }

  function displayQuestion(index) {
    clean();
    const question = Questions[index];

    if (!question) {
      displayFinishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);
    app.appendChild(submitButton);
  }

  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo! Tu as terminé le quiz. :)";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} point!`;

    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[name = "answer"]:checked');
    disableAllAnswer();
    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;

    if (isCorrect){
      score++;
    }
    
    showFeedback(isCorrect, question.correct, value);
    displayNextQuestionButton();
    const feedback = getFeedBackMessage(isCorrect, question.correct);
    app.appendChild(feedback);

  }

  function displayNextQuestionButton() {
    let remainingTimeout = TIMEOUT;

    app.querySelector("button").remove();

    const nextButton = document.createElement("button");
    nextButton.innerText = `Next (${remainingTimeout / 1000}s)`;
    app.appendChild(nextButton);

    const interval = setInterval(() => {
      remainingTimeout -= 1000;
      nextButton.innerText = `Next (${remainingTimeout / 1000}s)`;
    }, 1000);
    
    const timeout = setTimeout(() =>{
      handleNextQuestion()
    }, TIMEOUT);

    const handleNextQuestion = () => {
      currentQuestion++;
      clearInterval(interval);
      clearTimeout(timeout);
      displayQuestion(currentQuestion);
    }

    nextButton.addEventListener("click", () => {
      handleNextQuestion();
    })
  }disableAllAnswer
  function disableAllAnswer() {
    const radioInputs = document.querySelectorAll('input[type="radio"]')
    for (const radio of radioInputs){
      radio.disabled = true;
    }
  }

  function createAnswers(answers) {
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answersDiv.appendChild(label);
    }
    return answersDiv;
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
  return text.replaceAll(" ", "-").replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
}

function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatId(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );

  if (isCorrect) {
    selectedElement.classList.add("correct");
  }else{
    selectedElement.classList.add("incorrect");
    correctElement.classList.add("correct");
  }

}

function getFeedBackMessage(isCorrect, correct){
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect ? "Bravo ! Tu as eu la bonne repnse" 
  : `Désolé... Mais la bonne réponse était ${correct}`;

  return paragraph;
}

function getProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  return progress;
}