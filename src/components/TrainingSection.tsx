
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDown, Plus, Clock, CheckCircle, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toArabicNumerals, fromArabicNumerals, formatPercentageArabic } from '@/utils/arabicNumbers';

interface TrainingProps {
  onBack: () => void;
}

interface Question {
  num1: number;
  num2: number;
  answer: number;
}

const TrainingSection: React.FC<TrainingProps> = ({ onBack }) => {
  const [trainingMode, setTrainingMode] = useState<'select' | 'focused' | 'random' | 'timed'>('select');
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setShowResult(true);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const generateQuestion = () => {
    const tables = selectedTables.length > 0 ? selectedTables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const num1 = tables[Math.floor(Math.random() * tables.length)];
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    setCurrentQuestion({
      num1,
      num2,
      answer: num1 * num2
    });
    setUserAnswer('');
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;

    // تحويل الإجابة من الأرقام الهندية إلى الإنجليزية للمقارنة
    const userAnswerNum = fromArabicNumerals(userAnswer) || parseInt(userAnswer);
    const isCorrect = userAnswerNum === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "إجابة صحيحة! 🎉",
        description: `${toArabicNumerals(currentQuestion.num1)} × ${toArabicNumerals(currentQuestion.num2)} = ${toArabicNumerals(currentQuestion.answer)}`,
        duration: 2000,
      });
    } else {
      toast({
        title: "إجابة خاطئة 😔",
        description: `الإجابة الصحيحة: ${toArabicNumerals(currentQuestion.num1)} × ${toArabicNumerals(currentQuestion.num2)} = ${toArabicNumerals(currentQuestion.answer)}`,
        variant: "destructive",
        duration: 3000,
      });
    }

    setTotalQuestions(totalQuestions + 1);
    
    if (trainingMode === 'timed' && isTimerActive) {
      generateQuestion();
    } else if (trainingMode !== 'timed') {
      setTimeout(generateQuestion, 1500);
    }
  };

  const startTraining = (mode: 'focused' | 'random' | 'timed') => {
    setTrainingMode(mode);
    setScore(0);
    setTotalQuestions(0);
    setShowResult(false);
    
    if (mode === 'timed') {
      setTimeLeft(60);
      setIsTimerActive(true);
    }
    
    generateQuestion();
  };

  const resetTraining = () => {
    setTrainingMode('select');
    setCurrentQuestion(null);
    setUserAnswer('');
    setScore(0);
    setTotalQuestions(0);
    setTimeLeft(60);
    setIsTimerActive(false);
    setShowResult(false);
  };

  const toggleTable = (table: number) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  if (trainingMode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 rtl-container">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowDown className="rotate-90 icon-rtl" size={16} />
              العودة للقائمة الرئيسية
            </Button>
            <h1 className="text-3xl font-bold text-center flex items-center gap-3">
              <Plus className="text-green-600" size={32} />
              قسم التدريب
            </h1>
            <div></div>
          </div>

          {/* Table Selection */}
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-center">اختر الجداول التي تريد التدرب عليها</h3>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  onClick={() => toggleTable(num)}
                  variant={selectedTables.includes(num) ? "default" : "outline"}
                  className={`h-12 text-lg font-bold ${
                    selectedTables.includes(num) 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "hover:bg-green-50"
                  }`}
                >
                  {toArabicNumerals(num)}
                </Button>
              ))}
            </div>
            <p className="text-center text-gray-600">
              {selectedTables.length === 0 ? 
                "لم يتم اختيار أي جدول - سيتم التدريب على جميع الجداول" :
                `تم اختيار ${toArabicNumerals(selectedTables.length)} جدول`
              }
            </p>
          </Card>

          {/* Training Modes */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              onClick={() => startTraining('focused')}
            >
              <div className="text-center">
                <Plus className="mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">تدريب مركز</h3>
                <p className="text-blue-100">تدرب على الجداول المختارة بهدوء</p>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 text-white"
              onClick={() => startTraining('random')}
            >
              <div className="text-center">
                <Circle className="mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">تدريب عشوائي</h3>
                <p className="text-purple-100">أسئلة عشوائية من جميع الجداول</p>
              </div>
            </Card>

            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-red-500 to-red-600 text-white"
              onClick={() => startTraining('timed')}
            >
              <div className="text-center">
                <Clock className="mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">تدريب بالوقت</h3>
                <p className="text-red-100">تحدي الوقت - {toArabicNumerals(60)} ثانية!</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center rtl-container">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
          <h2 className="text-3xl font-bold mb-4">انتهى التدريب!</h2>
          <div className="space-y-3 mb-6">
            <p className="text-xl">النتيجة: {toArabicNumerals(score)} من {toArabicNumerals(totalQuestions)}</p>
            <p className="text-lg text-gray-600">النسبة المئوية: {formatPercentageArabic(percentage)}</p>
            <div className={`text-lg font-bold ${
              percentage >= 80 ? 'text-green-600' : 
              percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {percentage >= 80 ? '🌟 ممتاز!' : 
               percentage >= 60 ? '👍 جيد!' : '💪 يحتاج مزيد من التدريب'}
            </div>
          </div>
          <div className="space-x-3 space-x-reverse">
            <Button onClick={resetTraining} variant="outline">العودة للقائمة</Button>
            <Button onClick={() => startTraining(trainingMode as any)}>إعادة التدريب</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 rtl-container">
      <div className="max-w-2xl mx-auto">
        {/* Header with Timer and Score */}
        <div className="flex justify-between items-center mb-8">
          <Button onClick={resetTraining} variant="outline">إنهاء التدريب</Button>
          
          <div className="text-center">
            {trainingMode === 'timed' && (
              <div className="text-2xl font-bold text-red-600 mb-2">
                ⏰ {toArabicNumerals(timeLeft)}s
              </div>
            )}
            <div className="text-lg font-semibold">
              النتيجة: {toArabicNumerals(score)} / {toArabicNumerals(totalQuestions)}
            </div>
          </div>
          
          <div className="text-lg font-bold text-green-600">
            {formatPercentageArabic(totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0)}
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="p-8 text-center">
            <div className="text-6xl font-bold text-gray-700 mb-8">
              {toArabicNumerals(currentQuestion.num1)} × {toArabicNumerals(currentQuestion.num2)} = ؟
            </div>
            
            <div className="flex gap-4 justify-center items-center">
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && userAnswer && checkAnswer()}
                placeholder="أدخل الإجابة"
                className="text-2xl text-center font-bold w-32"
                autoFocus
              />
              <Button 
                onClick={checkAnswer} 
                disabled={!userAnswer}
                className="text-xl px-8 py-3"
              >
                تحقق
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrainingSection;
