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
    return response.status === 200;
  } catch {
    return false;
  }
};