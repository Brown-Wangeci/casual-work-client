type Status = 'created' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  offer: number;
  status: Status;
  taskPoster: User; // User ID or username of the task poster
  taskersApplied: User[] | null; // Array of user IDs or usernames
  taskerAssigned: User | null; // User ID or username of the assigned tasker
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  profilePicture: string; // Path to local image or URL
  rating: number;
  tasksPosted: number;
  tasksCompleted: number;
  isTasker: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

type Review = {
  id: string;
  reviewer: User;
  reviewee: User;
  task: Task;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};

type SignUpData = {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
};

type LoginData = {
  email: string;
  password: string;
};

type TaskInCreation = {
  title: string;
  description: string;
  category: string;
  location: string;
  offer: number | null; // Offer can be null initially
};

type CategoryOption = {
  label: string;
  value: string;
};

export type { Task, User, Status, TaskInCreation, CategoryOption, Review, SignUpData, LoginData };
