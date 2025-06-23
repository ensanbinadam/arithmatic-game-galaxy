
// تحويل الأرقام الإنجليزية إلى الأرقام الهندية الشرق أوسطية
export const toArabicNumerals = (num: number | string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
};

// تحويل الأرقام الهندية إلى الأرقام الإنجليزية (للحسابات)
export const fromArabicNumerals = (arabicNum: string): number => {
  const arabicToEnglish: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  const englishNum = arabicNum.replace(/[٠-٩]/g, (digit) => arabicToEnglish[digit] || digit);
  return parseInt(englishNum) || 0;
};

// تنسيق الوقت بالأرقام الهندية
export const formatTimeArabic = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${toArabicNumerals(minutes)}:${toArabicNumerals(remainingSeconds.toString().padStart(2, '0'))}`;
};

// تنسيق النسبة المئوية بالأرقام الهندية
export const formatPercentageArabic = (percentage: number): string => {
  return `${toArabicNumerals(percentage)}%`;
};
