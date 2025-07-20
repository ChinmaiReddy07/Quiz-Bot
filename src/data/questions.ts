import { Question } from '../types/quiz';

export const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'easy',
    timeLimit: 30
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'easy',
    timeLimit: 30
  },
  {
    id: '3',
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 2,
    category: 'Art',
    difficulty: 'medium',
    timeLimit: 30
  },
  {
    id: '4',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3,
    category: 'Geography',
    difficulty: 'easy',
    timeLimit: 30
  },
  {
    id: '5',
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'medium',
    timeLimit: 30
  },
  {
    id: '6',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium',
    timeLimit: 30
  },
  {
    id: '7',
    question: 'Which programming language was created by Guido van Rossum?',
    options: ['Java', 'Python', 'C++', 'JavaScript'],
    correctAnswer: 1,
    category: 'Technology',
    difficulty: 'medium',
    timeLimit: 30
  },
  {
    id: '8',
    question: 'What is the smallest country in the world?',
    options: ['Monaco', 'Nauru', 'Vatican City', 'San Marino'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'hard',
    timeLimit: 30
  },
  {
    id: '9',
    question: 'Who wrote "To Kill a Mockingbird"?',
    options: ['Harper Lee', 'Mark Twain', 'Ernest Hemingway', 'F. Scott Fitzgerald'],
    correctAnswer: 0,
    category: 'Literature',
    difficulty: 'medium',
    timeLimit: 30
  },
  {
    id: '10',
    question: 'What is the speed of light in vacuum?',
    options: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '298,792,458 m/s'],
    correctAnswer: 0,
    category: 'Physics',
    difficulty: 'hard',
    timeLimit: 30
  }
];