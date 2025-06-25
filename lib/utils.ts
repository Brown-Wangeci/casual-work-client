import { Status } from "@/constants/Types";
import { Alert } from "react-native";
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const calculateProgress = (status: Status ): number => {
    switch (status) {
        case 'pending':
        return 0;
        case 'in_progress':
        return 50;
        case 'completed':
        return 100;
        case 'cancelled':
        return 150;
        default:
        return 0;
    }
}

export const formatStatus = (status: Status): string => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'in_progress':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        case 'cancelled':
            return 'Cancelled';
        default:
            return 'Unknown Status';
    }
}


export const confirmAction = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  Alert.alert(
    'Confirm Action',
    message,
    [
      {
        text: 'Cancel',
        onPress: () => {
          onCancel?.();
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          onConfirm();
          console.log('User confirmed action');
        },
      },
    ],
    { cancelable: true }
  );
};


export const validateToken = async (token: string) => {
  try {
    const response = await axios.get(`${apiUrl}/auth/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Token validation response:', response.status);
    return response.status === 200;
  } catch {
    console.error('Token validation failed');
    return false;
  }
};


import { AxiosError } from 'axios';

/**
 * Extracts a clean error message from an AxiosError or unknown error.
 */
export function extractErrorMessage(error: unknown): string {
  const err = error as AxiosError;

  // Try to get a message from Axios response
  if (err.response?.data && typeof err.response.data === 'object') {
    const data = err.response.data as Record<string, any>;
    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  // Fallback to general error message
  if (err.message) return err.message;

  // Ultimate fallback
  return 'Something went wrong';
}


export function logError(error: unknown, context?: string) {
  const message = extractErrorMessage(error);
  if (context) {
    console.error(`[${context}] ${message}`);
  } else {
    console.error(message);
  }
}


export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  let formatted = '';
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    formatted = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('01') && cleaned.length === 10) {
    formatted = '254' + cleaned.slice(1);
  } else if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
    formatted = '254' + cleaned;
  } else if (cleaned.startsWith('254') && cleaned.length === 12) {
    formatted = cleaned;
  } else {
    throw new Error('Invalid phone number format');
  }

  return formatted;
};
