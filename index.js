import express from 'express';
import bodyParser from 'body-parser';
import quizQuestions from '../quizzer/src/quizQuestions.json' assert { type: 'json' };
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

let availableQuestions = [...quizQuestions];
let servedQuestions = [];

// Endpoint to get the next question
app.get('/question', (req, res) => {
  if (availableQuestions.length === 0) {
    // If all questions have been served, reset the available questions
    availableQuestions = [...quizQuestions];
    servedQuestions = [];
  }

  // Shuffle the available questions
  shuffleArray(availableQuestions);

  // Get the next question and remove it from the available questions
  const currentQuestion = availableQuestions.pop();
  servedQuestions.push(currentQuestion);

  res.json(currentQuestion);
});

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Endpoint to check the submitted answer
app.post('/answer', (req, res) => {
  const { questionId, answer } = req.body;
  const question = quizQuestions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  if (question.correctAnswer === answer) {
    res.json({ correct: true, explanation: 'Correct answer!' });
  } else {
    res.json({ correct: false, explanation: `Incorrect. The correct answer is ${question.correctAnswer}.` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
