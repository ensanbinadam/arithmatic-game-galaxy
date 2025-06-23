
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, BookOpen } from 'lucide-react';
import { toArabicNumerals } from '@/utils/arabicNumbers';

interface LearningProps {
  onBack: () => void;
}

const LearningSection: React.FC<LearningProps> = ({ onBack }) => {
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [showPattern, setShowPattern] = useState(false);

  const generateTable = (num: number) => {
    return Array.from({ length: 10 }, (_, i) => ({
      multiplier: i + 1,
      result: num * (i + 1)
    }));
  };

  const getTablePattern = (num: number) => {
    const patterns: { [key: number]: string } = {
      1: `جدول الـ ${toArabicNumerals(1)}: كل رقم مضروب في ${toArabicNumerals(1)} يبقى كما هو`,
      2: `جدول الـ ${toArabicNumerals(2)}: جميع النتائج أرقام زوجية (${toArabicNumerals(2)}, ${toArabicNumerals(4)}, ${toArabicNumerals(6)}, ${toArabicNumerals(8)}, ${toArabicNumerals(10)}, ${toArabicNumerals(12)}, ${toArabicNumerals(14)}, ${toArabicNumerals(16)}, ${toArabicNumerals(18)}, ${toArabicNumerals(20)})`,
      3: `جدول الـ ${toArabicNumerals(3)}: مجموع أرقام كل نتيجة يقبل القسمة على ${toArabicNumerals(3)}`,
      4: `جدول الـ ${toArabicNumerals(4)}: آخر رقمين في النتائج: ${toArabicNumerals(4)}, ${toArabicNumerals(8)}, ${toArabicNumerals(12)}, ${toArabicNumerals(16)}, ${toArabicNumerals(20)}, ${toArabicNumerals(24)}, ${toArabicNumerals(28)}, ${toArabicNumerals(32)}, ${toArabicNumerals(36)}, ${toArabicNumerals(40)}`,
      5: `جدول الـ ${toArabicNumerals(5)}: كل النتائج تنتهي بـ ${toArabicNumerals(0)} أو ${toArabicNumerals(5)}`,
      6: `جدول الـ ${toArabicNumerals(6)}: النتائج الزوجية تنتهي بنفس رقم المضاعف (${toArabicNumerals(6)}×${toArabicNumerals(2)}=${toArabicNumerals(12)}, ${toArabicNumerals(6)}×${toArabicNumerals(4)}=${toArabicNumerals(24)}, ${toArabicNumerals(6)}×${toArabicNumerals(6)}=${toArabicNumerals(36)})`,
      7: `جدول الـ ${toArabicNumerals(7)}: أصعب الجداول - يحتاج حفظ جيد!`,
      8: `جدول الـ ${toArabicNumerals(8)}: كل نتيجة هي ضعف نتيجة جدول الـ ${toArabicNumerals(4)}`,
      9: `جدول الـ ${toArabicNumerals(9)}: مجموع أرقام كل نتيجة يساوي ${toArabicNumerals(9)} (مثال: ${toArabicNumerals(18)} → ${toArabicNumerals(1)}+${toArabicNumerals(8)}=${toArabicNumerals(9)})`,
      10: `جدول الـ ${toArabicNumerals(10)}: أسهل الجداول - فقط أضف صفر للرقم!`
    };
    return patterns[num] || "نمط رياضي مثير للاهتمام!";
  };

  const tableData = generateTable(selectedTable);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 rtl-container">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowDown className="rotate-90 icon-rtl" size={16} />
            العودة للقائمة الرئيسية
          </Button>
          <h1 className="text-3xl font-bold text-center flex items-center gap-3">
            <BookOpen className="text-blue-600" size={32} />
            قسم التعلم
          </h1>
          <div></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Table Selector */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">اختر الجدول</h3>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  onClick={() => setSelectedTable(num)}
                  variant={selectedTable === num ? "default" : "outline"}
                  className={`h-12 text-lg font-bold ${
                    selectedTable === num 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "hover:bg-blue-50"
                  }`}
                >
                  {toArabicNumerals(num)}
                </Button>
              ))}
            </div>
          </Card>

          {/* Multiplication Table Display */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-600">
                جدول الضرب للرقم {toArabicNumerals(selectedTable)}
              </h3>
              <Button
                onClick={() => setShowPattern(!showPattern)}
                variant="outline"
                className="text-sm"
              >
                {showPattern ? "إخفاء النمط" : "إظهار النمط"}
              </Button>
            </div>

            {showPattern && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-r-4 border-yellow-400">
                <p className="text-gray-700 font-medium">
                  💡 {getTablePattern(selectedTable)}
                </p>
              </div>
            )}

            <div className="grid gap-3">
              {tableData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-r-4 border-blue-400"
                >
                  <div className="text-lg font-bold text-gray-700">
                    {toArabicNumerals(selectedTable)} × {toArabicNumerals(item.multiplier)}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    = {toArabicNumerals(item.result)}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Pattern for Special Tables */}
            {selectedTable === 5 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold mb-2">النمط البصري لجدول الـ {toArabicNumerals(5)}:</h4>
                <div className="flex flex-wrap gap-2">
                  {tableData.map((item, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-white font-bold ${
                        item.result % 10 === 0 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {toArabicNumerals(item.result)}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  🟢 الأخضر = ينتهي بصفر | 🔵 الأزرق = ينتهي بخمسة
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningSection;
