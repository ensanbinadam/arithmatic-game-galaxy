
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, CheckCircle, Clock, BookOpen } from 'lucide-react';

interface ProgressProps {
  onBack: () => void;
}

interface QuizResult {
  date: string;
  score: number;
  total: number;
  difficulty: string;
  tables: number[];
}

const ProgressSection: React.FC<ProgressProps> = ({ onBack }) => {
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Load quiz history from localStorage
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    setQuizHistory(history);

    // Calculate achievements
    const newAchievements = [];
    if (history.length >= 1) newAchievements.push('first-quiz');
    if (history.length >= 5) newAchievements.push('five-quizzes');
    if (history.length >= 10) newAchievements.push('ten-quizzes');
    if (history.some((h: QuizResult) => h.score === h.total)) newAchievements.push('perfect-score');
    if (history.some((h: QuizResult) => h.score / h.total >= 0.9)) newAchievements.push('excellent');
    
    setAchievements(newAchievements);
  }, []);

  const calculateOverallStats = () => {
    if (quizHistory.length === 0) return { totalQuizzes: 0, averageScore: 0, bestScore: 0 };

    const totalQuizzes = quizHistory.length;
    const totalScore = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
    const totalQuestions = quizHistory.reduce((sum, quiz) => sum + quiz.total, 0);
    const averageScore = Math.round((totalScore / totalQuestions) * 100);
    const bestScore = Math.max(...quizHistory.map(quiz => Math.round((quiz.score / quiz.total) * 100)));

    return { totalQuizzes, averageScore, bestScore };
  };

  const getAchievementInfo = (achievement: string) => {
    const achievements_info: { [key: string]: { title: string; description: string; icon: string } } = {
      'first-quiz': { title: 'أول اختبار', description: 'أكملت أول اختبار لك!', icon: '🎯' },
      'five-quizzes': { title: 'متدرب مثابر', description: 'أكملت 5 اختبارات', icon: '🏃‍♂️' },
      'ten-quizzes': { title: 'خبير جداول الضرب', description: 'أكملت 10 اختبارات', icon: '🧠' },
      'perfect-score': { title: 'النتيجة الكاملة', description: 'حصلت على العلامة الكاملة!', icon: '🌟' },
      'excellent': { title: 'متفوق', description: 'حصلت على 90% أو أكثر', icon: '🏆' }
    };
    return achievements_info[achievement] || { title: achievement, description: '', icon: '🎖️' };
  };

  const stats = calculateOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowDown className="rotate-90" size={16} />
            العودة للقائمة الرئيسية
          </Button>
          <h1 className="text-3xl font-bold text-center flex items-center gap-3">
            <CheckCircle className="text-purple-600" size={32} />
            تتبع التقدم
          </h1>
          <div></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Overall Statistics */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              📊 الإحصائيات العامة
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.totalQuizzes}</div>
                <div className="text-gray-600">إجمالي الاختبارات</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{stats.averageScore}%</div>
                <div className="text-gray-600">المتوسط العام</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.bestScore}%</div>
                <div className="text-gray-600">أفضل نتيجة</div>
              </div>
            </div>

            {/* Recent Quiz History */}
            <h3 className="text-xl font-bold mb-4">📈 آخر النتائج</h3>
            {quizHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>لم تقم بأي اختبار بعد</p>
                <p className="text-sm">ابدأ أول اختبار لك لتتبع تقدمك!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {quizHistory.slice(-5).reverse().map((quiz, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">
                        {quiz.score} / {quiz.total} ({Math.round((quiz.score / quiz.total) * 100)}%)
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(quiz.date).toLocaleDateString('ar-SA')} - {quiz.difficulty}
                      </div>
                    </div>
                    <div className={`text-lg ${
                      quiz.score / quiz.total >= 0.9 ? 'text-green-600' :
                      quiz.score / quiz.total >= 0.7 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {quiz.score / quiz.total >= 0.9 ? '🌟' :
                       quiz.score / quiz.total >= 0.7 ? '👍' : '💪'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              🏆 الإنجازات
            </h2>
            
            {achievements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>لا توجد إنجازات بعد</p>
                <p className="text-sm">ابدأ التعلم لكسب الإنجازات!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {achievements.map((achievement, index) => {
                  const info = getAchievementInfo(achievement);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <div className="font-bold text-gray-800">{info.title}</div>
                        <div className="text-sm text-gray-600">{info.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upcoming Achievements */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-bold mb-3 text-gray-700">🎯 إنجازات قادمة</h3>
              <div className="space-y-2 text-sm">
                {!achievements.includes('first-quiz') && (
                  <div className="text-gray-600">🎯 أكمل أول اختبار</div>
                )}
                {!achievements.includes('perfect-score') && (
                  <div className="text-gray-600">🌟 احصل على العلامة الكاملة</div>
                )}
                {!achievements.includes('ten-quizzes') && (
                  <div className="text-gray-600">🧠 أكمل 10 اختبارات</div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Motivational Message */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">💪 استمر في التعلم!</h3>
            <p>كل يوم تتدرب فيه على جداول الضرب تصبح أقوى في الرياضيات</p>
            {stats.totalQuizzes > 0 && (
              <p className="mt-2 text-purple-100">
                أكملت {stats.totalQuizzes} اختبار حتى الآن - استمر هكذا! 🎉
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressSection;
