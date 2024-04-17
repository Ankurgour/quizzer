import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function FrontEndQuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    if (quizStarted) {
      fetchNextQuestion();
    }
  }, [quizStarted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setAnswerFeedback('');
    setScore(0);
    setVisitedQuestions([]);
    setQuestionsAnswered(0);
  };

  const selectAnswer = async (answer) => {
    try {
      const response = await axios.post('https://quizzer-pkjn.onrender.com/answer', {
        questionId: currentQuestion.id,
        answer: answer,
      });
      if (response.data.correct) {
        setScore(score + 1);
        setAnswerFeedback('Correct!');
      } else {
        setAnswerFeedback(response.data.explanation);
      }
      setTimeout(() => {
        setAnswerFeedback('');
      }, 4000);
      setQuestionsAnswered(questionsAnswered + 1);
      if (questionsAnswered === 9) {
        endQuiz();
      } else {
        fetchNextQuestion();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const fetchNextQuestion = async () => {
    try {
      const response = await axios.get('https://quizzer-pkjn.onrender.com/question');
      const nextQuestion = response.data;
      if (!visitedQuestions.includes(nextQuestion.id)) {
        setCurrentQuestion(nextQuestion);
        setVisitedQuestions([...visitedQuestions, nextQuestion.id]);
      } else {
        fetchNextQuestion();
      }
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  const endQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(null);
  };

  const renderQuestion = () => {
    return (
      <div>
        <h2>{currentQuestion.question}</h2>
        <div>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="option" onClick={() => selectAnswer(option)}>
              {option}
            </div>
          ))}
        </div>
        <div className="feedback" style={{ backgroundColor: answerFeedback === 'Correct!' ? 'green' : 'red', textAlign: 'center', color: 'white' }}> {answerFeedback}</div>
      </div>
    );
  };

  const renderScore = () => {
    return (
      <div>
        <h2>Quiz Ended</h2>
        <h3>Your Score: {score}</h3>
        <button onClick={startQuiz}>Start Again</button>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Welcome to the Node.js Quiz!</h1>
      <div className="score">Score: {score}</div>
      {!quizStarted && (
        <button onClick={startQuiz}>Start Quiz</button>
      )}
      {quizStarted && (
        <div>
          {currentQuestion && questionsAnswered < 10 ? renderQuestion() : renderScore()}
        </div>
      )}
    </div>
  );
}

export default FrontEndQuizApp;
