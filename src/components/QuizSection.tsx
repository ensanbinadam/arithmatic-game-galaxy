
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizProps {
  onBack: () => void;
}

interface QuizQuestion {
  question: string;
  options: number[];
  correct: number;
  type: 'multiple' | 'truefalse' | 'fill';
}

const QuizSection: React.FC<QuizProps> = ({ onBack }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      completeQuiz();
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, quizCompleted]);

  const generateQuestions = () => {
    const tables = selectedTables.length > 0 ? selectedTables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const questionCount = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    const newQuestions: QuizQuestion[] = [];

    for (let i = 0; i < questionCount; i++) {
      const type = Math.random() < 0.7 ? 'multiple' : Math.random() < 0.5 ? 'truefalse' : 'fill';
      const num1 = tables[Math.floor(Math.random() * tables.length)];
      const num2 = Math.floor(Math.random() * 10) + 1;
      const correct = num1 * num2;

      if (type === 'multiple') {
        const options = [correct];
        while (options.length < 4) {
          const wrong = correct + Math.floor(Math.random() * 20) - 10;
          if (wrong > 0 && !options.includes(wrong)) {
            options.push(wrong);
          }
        }
        
        newQuestions.push({
          question: `${num1} × ${num2} = ?`,
          options: options.sort(() => Math.random() - 0.5),
          correct,
          type: 'multiple'
        });
      } else if (type === 'truefalse') {
        const isTrue = Math.random() < 0.5;
        const displayAnswer = isTrue ? correct : correct + Math.floor(Math.random() * 10) + 1;
        
        newQuestions.push({
          question: `${num1} × ${num2} = ${displayAnswer}`,
          options: [1, 0], // 1 = صحيح, 0 = خطأ
          correct: isTrue ? 1 : 0,
          type: 'truefalse'
        });
      }
    }

    setQuestions(newQuestions);
  };

  const startQuiz = () => {
    generateQuestions();
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(difficulty === 'easy' ? 300 : difficulty === 'medium' ? 420 : 600);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    const finalScore = selectedAnswer === questions[currentQuestionIndex]?.correct ? score + 1 : score;
    
    // Save quiz result to localStorage
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    quizHistory.push({
      date: new Date().toISOString(),
      score: finalScore,
      total: questions.length,
      difficulty,
      tables: selectedTables
    });
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
  };

  const toggleTable = (table: number) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
          <h2 className="text-3xl font-bold mb-4">انتهى الاختبار!</h2>
          <div className="space-y-3 mb-6">
            <p className="text-xl">النتيجة: {score} من {questions.length}</p>
            <p className="text-lg text-gray-600">النسبة المئوية: {percentage}%</p>
            <div className={`text-lg font-bold ${
              percentage >= 90 ? 'text-green-600' : 
              percentage >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {percentage >= 90 ? '🏆 ممتاز جداً!' : 
               percentage >= 70 ? '🌟 جيد جداً!' : 
               percentage >= 50 ? '👍 جيد!' : '💪 يحتاج مزيد من المراجعة'}
            </div>
          </div>
          <div className="space-x-3 space-x-reverse">
            <Button onClick={resetQuiz} variant="outline">اختبار جديد</Button>
            <Button onClick={onBack}>العودة للقائمة</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowDown className="rotate-90" size={16} />
              العودة للقائمة الرئيسية
            </Button>
            <h1 className="text-3xl font-bold text-center flex items-center gap-3">
              <Clock className="text-orange-600" size={32} />
              قسم الاختبارات
            </h1>
            <div></div>
          </div>

          {/* Quiz Setup */}
          <div className="space-y-8">
            {/* Table Selection */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-center">اختر الجداول</h3>
              <div className="grid grid-cols-5 gap-3 mb-4">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    onClick={() => toggleTable(num)}
                    variant={selectedTables.includes(num) ? "default" : "outline"}
                    className={`h-12 text-lg font-bold ${
                      selectedTables.includes(num) 
                        ? "bg-orange-600 hover:bg-orange-700" 
                        : "hover:bg-orange-50"
                    }`}
                  >
                    {num}
                  </Button>
                ))}
              </div>
              <p className="text-center text-gray-600">
                {selectedTables.length === 0 ? 
                  "سيتم اختبارك في جميع الجداول" :
                  `سيتم اختبارك في ${selectedTables.length} جدول`
                }
              </p>
            </Card>

            {/* Difficulty Selection */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-center">مستوى الصعوبة</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setDifficulty('easy')}
                  variant={difficulty === 'easy' ? "default" : "outline"}
                  className={`p-4 h-auto ${difficulty === 'easy' ? "bg-green-600" : ""}`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">سهل</div>
                    <div className="text-sm opacity-80">10 أسئلة - 5 دقائق</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setDifficulty('medium')}
                  variant={difficulty === 'medium' ? "default" : "outline"}
                  className={`p-4 h-auto ${difficulty === 'medium' ? "bg-yellow-600" : ""}`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">متوسط</div>
                    <div className="text-sm opacity-80">15 سؤال - 7 دقائق</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setDifficulty('hard')}
                  variant={difficulty === 'hard' ? "default" : "outline"}
                  className={`p-4 h-auto ${difficulty === 'hard' ? "bg-red-600" : ""}`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">صعب</div>
                    <div className="text-sm opacity-80">20 سؤال - 10 دقائق</div>
                  </div>
                </Button>
              </div>
            </Card>

            <div className="text-center">
              <Button onClick={startQuiz} size="lg" className="text-xl px-8 py-4">
                🚀 ابدأ الاختبار
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button onClick={resetQuiz} variant="outline">إنهاء الاختبار</Button>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              ⏰ {formatTime(timeLeft)}
            </div>
            <div className="text-lg">
              السؤال {currentQuestionIndex + 1} من {questions.length}
            </div>
          </div>
          
          <div className="text-lg font-bold text-green-600">
            النتيجة: {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              {currentQuestion.question}
            </h2>
            {currentQuestion.type === 'truefalse' && (
              <p className="text-gray-600">هل هذه المعادلة صحيحة أم خاطئة؟</p>
            )}
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'multiple' && currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`w-full p-4 text-xl ${
                  selectedAnswer === option ? "bg-orange-600" : ""
                }`}
              >
                {option}
              </Button>
            ))}

            {currentQuestion.type === 'truefalse' && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAnswerSelect(1)}
                  variant={selectedAnswer === 1 ? "default" : "outline"}
                  className={`p-4 text-xl ${selectedAnswer === 1 ? "bg-green-600" : ""}`}
                >
                  ✅ صحيح
                </Button>
                <Button
                  onClick={() => handleAnswerSelect(0)}
                  variant={selectedAnswer === 0 ? "default" : "outline"}
                  className={`p-4 text-xl ${selectedAnswer === 0 ? "bg-red-600" : ""}`}
                >
                  ❌ خطأ
                </Button>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
              size="lg"
              className="px-8"
            >
              {currentQuestionIndex + 1 === questions.length ? "إنهاء الاختبار" : "السؤال التالي"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizSection;
