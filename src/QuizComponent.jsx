import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import svg1 from './assets/images/svg1.png';

function QuizComponent() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [answerStatus, setAnswerStatus] = useState([]);
  const [timer, setTimer] = useState(60);
  const [showPopup, setShowPopup] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [timeUp, setTimeUp] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [studentScore, setStudentScore] = useState(0);

  const handleStartQuiz = () => {
    if (studentName && studentEmail) {
      setShowPopup(false);
      startTimer();
    } else {
      alert('Please enter your name and email address.');
    }
  };

  useEffect(() => {
    axios
      .get("https://opentdb.com/api.php?amount=49&category=18&type=multiple")
      .then((response) => {
        const data = response.data;
        const shuffledQuestions = data.results.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const question = questions[currentQuestion];
      const answers = [...question.incorrect_answers, question.correct_answer];
      const shuffled = shuffleArray(answers);
      setShuffledAnswers(shuffled);
    }
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (timer > 0 && !showResult && !timeUp) {
      const timerInterval = setInterval(() => {
        setTimer(timer - 1);
        if (timer - 1 === 0) {
          clearInterval(timerInterval);
          handleTimeUp();
          calculateStudentScore();
          showCongratulationsModal();
        }
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [timer, showResult, timeUp]);

  const startTimer = () => {
    setTimer(60);
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    handleNextQuestion();
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      const correctAnswer = questions[currentQuestion].correct_answer;
      const isCorrect = selectedAnswer === correctAnswer;
      setAnswerStatus((prevStatus) => [...prevStatus, isCorrect]);
      setSelectedAnswer('');

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    } else {
      alert('Please answer the question before moving to the next one.');
    }
  };

  const calculateStudentScore = () => {
    const correctAnswers = answerStatus.filter((status) => status).length;
    setStudentScore(correctAnswers);
  };

  const showCongratulationsModal = () => {
    setShowCongratulation(true);
  };

  const renderQuestion = () => {
    if (questions.length === 0) {
      return <p>Loading questions...</p>;
    }

    const question = questions[currentQuestion];
    const answerLetters = ['A', 'B', 'C', 'D'];

    return (
      <section className="steps">
        <h1 className="quiz-question">{question.question}</h1>
        <fieldset id="step1">
          {shuffledAnswers.map((answer, index) => (
            <div
              key={index}
              className={`radio-field bounce-left ${selectedAnswer === answer
                ? answer === question.correct_answer
                  ? 'correct'
                  : 'incorrect'
                : ''
                }`}
              onClick={() => handleAnswerClick(answer)}
            >
              <input
                type="radio"
                name="op1"
                value={answer}
                checked={selectedAnswer === answer}
                readOnly
              />
              <label className={`op1 ${selectedAnswer === answer ? (answer === question.correct_answer ? 'correct' : 'incorrect') : ''}`}>
                {answerLetters[index]}. {answer}
              </label>
            </div>
          ))}
        </fieldset>
        <div className="next-prev">
          <button className="next" type="button" onClick={handleNextQuestion}>
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Show Results'}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>
    );
  };

  const renderResult = () => {
    return (
      <div style={{ height: '500px', overflow: 'auto' }}>
        <h1>Quiz Results</h1>
        <p>
          You answered {answerStatus.filter((status) => status).length} out of {questions.length} questions correctly.
        </p>
        <p>Questions and Correct Answers:</p>
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              {question.question}
              <br />
              Correct Answer: {question.correct_answer}
              <br />
              Your Answer: {answerStatus[index] ? 'Correct' : 'Wrong'}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <main className="overflow-hidden">
      <div className="row">
        <div className="col-md-6 tab-100 order-c tab-none side-fixed">
          <div className="side">
            <div className="timer">
              <div id="countdown-timer">{timer}</div>
            </div>
            <img className="svg-1" src={svg1} alt="svg1" />
          </div>
        </div>
        <div className="main-bg col-md-6 tab-100">
          <div className="main-inner">
            <div className="step-count">
              {showResult ? null : <p>Question {currentQuestion + 1} of {questions.length}</p>}
            </div>
            <form method="post" className="show-section">
              {showResult || timeUp ? renderResult() : renderQuestion()}
            </form>
          </div>
        </div>
      </div>

      <Modal show={showPopup} onHide={() => { }}>
        <Modal.Header closeButton>
          <Modal.Title>Start Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Mail"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleStartQuiz}>
            Start
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCongratulation} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Name: {studentName}</p>
          <p>Email: {studentEmail}</p>
          <p>Your Score: {studentScore} out of {questions.length}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowCongratulation(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default QuizComponent;
