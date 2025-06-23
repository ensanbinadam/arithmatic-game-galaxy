
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Clock, CheckCircle } from 'lucide-react';
import LearningSection from '@/components/LearningSection';
import TrainingSection from '@/components/TrainingSection';
import QuizSection from '@/components/QuizSection';
import ProgressSection from '@/components/ProgressSection';
import { toArabicNumerals } from '@/utils/arabicNumbers';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'learn':
        return <LearningSection onBack={() => setActiveSection('home')} />;
      case 'train':
        return <TrainingSection onBack={() => setActiveSection('home')} />;
      case 'quiz':
        return <QuizSection onBack={() => setActiveSection('home')} />;
      case 'progress':
        return <ProgressSection onBack={() => setActiveSection('home')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 rtl-container">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  🧮 أكاديمية جداول الضرب
                </h1>
                <p className="text-xl text-gray-600">
                  تعلم جداول الضرب من {toArabicNumerals(1)} إلى {toArabicNumerals(10)} بطريقة ممتعة وتفاعلية!
                </p>
              </div>

              {/* Main Menu Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105"
                  onClick={() => setActiveSection('learn')}
                >
                  <div className="text-center">
                    <BookOpen className="mx-auto mb-4" size={48} />
                    <h3 className="text-2xl font-bold mb-3">التعلم</h3>
                    <p className="text-blue-100">
                      استكشف جداول الضرب مع الشرح التفصيلي والأنماط الرياضية
                    </p>
                  </div>
                </Card>

                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-500 to-green-600 text-white hover:scale-105"
                  onClick={() => setActiveSection('train')}
                >
                  <div className="text-center">
                    <Plus className="mx-auto mb-4" size={48} />
                    <h3 className="text-2xl font-bold mb-3">التدريب</h3>
                    <p className="text-green-100">
                      تدرب على جداول الضرب بطرق متنوعة وممتعة
                    </p>
                  </div>
                </Card>

                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-orange-500 to-red-500 text-white hover:scale-105"
                  onClick={() => setActiveSection('quiz')}
                >
                  <div className="text-center">
                    <Clock className="mx-auto mb-4" size={48} />
                    <h3 className="text-2xl font-bold mb-3">الاختبارات</h3>
                    <p className="text-orange-100">
                      اختبر معلوماتك في جداول الضرب واكسب النقاط
                    </p>
                  </div>
                </Card>

                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-105"
                  onClick={() => setActiveSection('progress')}
                >
                  <div className="text-center">
                    <CheckCircle className="mx-auto mb-4" size={48} />
                    <h3 className="text-2xl font-bold mb-3">التقدم</h3>
                    <p className="text-purple-100">
                      تابع إنجازاتك وإحصائياتك في التعلم
                    </p>
                  </div>
                </Card>
              </div>

              {/* Fun Facts Section */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
                  💡 هل تعلم؟
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <strong>جدول الـ {toArabicNumerals(9)}:</strong> مجموع أرقام حاصل ضرب أي رقم في {toArabicNumerals(9)} يساوي دائماً {toArabicNumerals(9)}!
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <strong>جدول الـ {toArabicNumerals(5)}:</strong> ينتهي دائماً بـ {toArabicNumerals(0)} أو {toArabicNumerals(5)}
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <strong>جدول الـ {toArabicNumerals(2)}:</strong> كل النتائج أرقام زوجية
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <strong>جدول الـ {toArabicNumerals(10)}:</strong> أسهل الجداول - فقط أضف صفر!
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return renderActiveSection();
};

export default Index;
