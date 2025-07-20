import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, ArrowLeft, Settings, Play } from 'lucide-react';
import { Question, Quiz, QuizSettings } from '../types/quiz';
import { quizStorage } from '../utils/quizStorage';

interface QuizCreatorProps {
  onBack: () => void;
  onQuizCreated: (quiz: Quiz) => void;
  editingQuiz?: Quiz | null;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onBack, onQuizCreated, editingQuiz }) => {
  const [quizTitle, setQuizTitle] = useState(editingQuiz?.title || '');
  const [quizDescription, setQuizDescription] = useState(editingQuiz?.description || '');
  const [questions, setQuestions] = useState<Question[]>(editingQuiz?.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: 'General',
    difficulty: 'medium',
    timeLimit: 30,
    points: 100,
    explanation: ''
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>(editingQuiz?.settings || {
    timePerQuestion: 30,
    showCorrectAnswer: true,
    allowRejoining: true,
    shuffleQuestions: false,
    shuffleAnswers: false,
    maxPlayers: 50,
    requireApproval: false,
    showLeaderboard: true
  });

  const categories = ['General', 'Science', 'History', 'Geography', 'Sports', 'Entertainment', 'Technology', 'Art', 'Literature', 'Mathematics'];
  const difficulties = ['easy', 'medium', 'hard'] as const;

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const newQuestion: Question = {
      ...currentQuestion,
      id: Date.now().toString(),
      options: currentQuestion.options.filter(opt => opt.trim())
    };

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setCurrentQuestion({
      id: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      category: 'General',
      difficulty: 'medium',
      timeLimit: 30,
      points: 100,
      explanation: ''
    });
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setEditingIndex(index);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveQuiz = () => {
    if (!quizTitle.trim() || questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    const quiz: Quiz = {
      id: editingQuiz?.id || quizStorage.generateQuizId(),
      title: quizTitle,
      description: quizDescription,
      hostId: editingQuiz?.hostId || 'host_' + Date.now(),
      hostName: editingQuiz?.hostName || 'Quiz Host',
      questions,
      settings,
      createdAt: editingQuiz?.createdAt || new Date(),
      isActive: false,
      players: editingQuiz?.players || [],
      currentState: {
        isActive: false,
        currentQuestion: 0,
        timeRemaining: settings.timePerQuestion,
        showResults: false,
        isPaused: false
      }
    };

    quizStorage.saveQuiz(quiz);
    alert(`Quiz "${quiz.title}" saved successfully!`);
    onQuizCreated(quiz);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Info & Question Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quiz Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Quiz Title</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    placeholder="Brief description of your quiz"
                  />
                </div>
              </div>
            </div>

            {/* Question Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingIndex !== null ? 'Edit Question' : 'Add Question'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Question</label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Option {index + 1} {index === currentQuestion.correctAnswer && '(Correct)'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({...currentQuestion, options: newOptions});
                          }}
                          className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${index + 1}`}
                        />
                        <button
                          onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                          className={`px-3 py-3 rounded-lg transition-colors ${
                            index === currentQuestion.correctAnswer
                              ? 'bg-green-500 text-white'
                              : 'bg-white/20 text-white/60 hover:bg-white/30'
                          }`}
                        >
                          ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                    <select
                      value={currentQuestion.category}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={currentQuestion.difficulty}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as any})}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff} className="bg-gray-800 capitalize">{diff}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Time Limit (s)</label>
                    <input
                      type="number"
                      value={currentQuestion.timeLimit}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, timeLimit: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="10"
                      max="120"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Explanation (Optional)</label>
                  <textarea
                    value={currentQuestion.explanation}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
                    placeholder="Explain why this is the correct answer"
                  />
                </div>

                <button
                  onClick={addQuestion}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {editingIndex !== null ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingIndex !== null ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </div>
          </div>

          {/* Questions List & Settings */}
          <div className="space-y-6">
            {/* Questions List */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Questions ({questions.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm line-clamp-2">{q.question}</h4>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => editQuestion(index)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(index)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span className="bg-purple-500/30 px-2 py-1 rounded">{q.category}</span>
                      <span className={`px-2 py-1 rounded ${
                        q.difficulty === 'easy' ? 'bg-green-500/30' :
                        q.difficulty === 'medium' ? 'bg-yellow-500/30' : 'bg-red-500/30'
                      }`}>{q.difficulty}</span>
                      <span>{q.timeLimit}s</span>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && (
                  <p className="text-white/60 text-center py-8">No questions added yet</p>
                )}
              </div>
            </div>

            {/* Quiz Settings */}
            {showSettings && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quiz Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Max Players</label>
                    <input
                      type="number"
                      value={settings.maxPlayers}
                      onChange={(e) => setSettings({...settings, maxPlayers: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'showCorrectAnswer', label: 'Show correct answers' },
                      { key: 'allowRejoining', label: 'Allow rejoining' },
                      { key: 'shuffleQuestions', label: 'Shuffle questions' },
                      { key: 'shuffleAnswers', label: 'Shuffle answer options' },
                      { key: 'showLeaderboard', label: 'Show live leaderboard' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-3 text-white/80">
                        <input
                          type="checkbox"
                          checked={settings[key as keyof QuizSettings] as boolean}
                          onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                          className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Quiz */}
            <button
              onClick={saveQuiz}
              disabled={!quizTitle.trim() || questions.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 disabled:transform-none disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {editingQuiz ? 'Update Quiz' : 'Save Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;