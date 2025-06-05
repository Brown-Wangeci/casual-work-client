import { Status } from "@/constants/Types";

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