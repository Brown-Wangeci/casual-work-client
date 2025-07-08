type Status = 'CREATED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEW' | 'CANCELLED';
type PaymentStatus = 'UNCONFIRMED' | 'POSTER_CONFIRMED' | 'CONFIRMED' | 'CONFLICT';

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  offer: number;
  status: Status;
  taskPoster: User;
  taskersApplied: User[] | null;
  taskerAssigned: User | null;
  taskerRated: boolean;
  taskPosterRated: boolean;
  taskPayment: PaymentStatus;
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
  createdAt: Date; // ISO string
  updatedAt: Date; // ISO string
};

type TaskApplicationStatus = 'PENDING' | 'ACCEPTED' | 'DENIED';

type TaskApplication = {
  id: string;
  appliedAt: Date;
  status: TaskApplicationStatus;
  task: Task;
  user: User;
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
  offer: number | null;
  latitude: number | null;
  longitude: number | null;
};

type CategoryOption = {
  label: string;
  value: string;
};

export type { Task, User, Status, TaskInCreation, CategoryOption, Review, SignUpData, LoginData, TaskApplication, TaskApplicationStatus };
