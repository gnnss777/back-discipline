export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: string;
  paymentStatus: 'free' | 'paid';
  stripeCustomerId?: string;
}

export interface UserSession {
  userId: string;
  email: string;
  name?: string;
  paymentStatus: 'free' | 'paid';
  loggedInAt: string;
}