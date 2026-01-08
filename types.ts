
export type Language = 'fr' | 'ar';

export type UserRole = 'user' | 'admin';

export type SubscriptionStatus = 'active' | 'paused' | 'expired';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiry: string; // ISO date string
}

export interface BilingualText {
  fr: string;
  ar: string;
}

export interface BudgetNotification {
  id: string;
  type: 'warning' | 'danger';
  categoryId: string;
  categoryName: BilingualText;
  message: BilingualText;
  timestamp: number;
}

export interface Question {
  id: number;
  text: BilingualText;
  type: 'choice' | 'number' | 'multi';
  options?: { label: BilingualText; value: number }[];
  condition?: (answers: Record<number, any>) => boolean;
}

export interface BudgetCategory {
  id: string;
  name: BilingualText;
  budgeted: number;
  spent: number;
  icon?: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
}

export interface UserData {
  answers: Record<number, any>;
  salary: number;
  otherIncome: number;
  budgetPlan: BudgetCategory[];
  expenses: Expense[];
}

export enum AppStep {
  LOGIN = 'login',
  INTRO = 'intro',
  QUESTIONNAIRE = 'questionnaire',
  BUDGET_PLAN = 'budget_plan',
  TRACKER = 'tracker',
  ADMIN = 'admin',
  PAUSED = 'paused',
  BILAN = 'bilan'
}
