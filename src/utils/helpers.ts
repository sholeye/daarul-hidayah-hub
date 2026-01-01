import QRCode from 'qrcode';

export const generateStudentId = (firstName: string, existingCount: number): string => {
  const cleanName = firstName.replace(/[^a-zA-Z]/g, '');
  const paddedNumber = String(existingCount + 1).padStart(3, '0');
  return `${cleanName}_${paddedNumber}`;
};

export const generateQRCode = async (studentId: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(studentId, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0F5132',
        light: '#FFFFFF',
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateGrade = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  if (score >= 40) return 'E';
  return 'F';
};

export const getGradeRemarks = (grade: string): string => {
  const remarks: Record<string, string> = {
    'A+': 'Outstanding',
    'A': 'Excellent',
    'B': 'Very Good',
    'C': 'Good',
    'D': 'Fair',
    'E': 'Pass',
    'F': 'Fail',
  };
  return remarks[grade] || 'N/A';
};

export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
