const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Already in international format with + or 254
  if ((cleaned.startsWith('254') && cleaned.length === 12)) {
    return '+254' + cleaned.slice(3);
  }

  // Format 07XXXXXXXX or 01XXXXXXXX
  if ((cleaned.startsWith('07') || cleaned.startsWith('01')) && cleaned.length === 10) {
    return '+254' + cleaned.slice(1);
  }

  // Format 7XXXXXXXX or 1XXXXXXXX
  if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
    return '+254' + cleaned;
  }

  throw new Error('Invalid phone number format. Please use formats like 0712345678 or +254712345678.');
};

export const safeFormatPhoneNumber = (phone: string): string | null => {
  try {
    return formatPhoneNumber(phone);
  } catch {
    return null;
  }
};
