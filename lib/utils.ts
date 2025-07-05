import { Status } from "@/constants/Types";
import { Alert } from "react-native";
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const calculateProgress = (status: Status): number => {
  switch (status) {
    case 'CREATED':
      return 10;
    case 'PENDING':
      return 25;
    case 'IN_PROGRESS':
      return 50;
    case 'REVIEW':
      return 75;
    case 'COMPLETED':
      return 100;
    case 'CANCELLED':
      return 101; // visually distinct (over 100%)
    default:
      return 0;
  }
};



export const formatStatus = (status: Status): string => {
    switch (status) {
        case 'PENDING':
            return 'Pending';
        case 'IN_PROGRESS':
            return 'In Progress';
        case 'REVIEW':
            return 'Under Review';
        case 'COMPLETED':
            return 'Completed';
        case 'CANCELLED':
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
    return { isValid: response.status === 200, user: response.data.user };
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

