export type UserRole = 'admin' | 'parent';
export type UserStatus = 'pending' | 'approved';
export type ScoutSection = 'manada' | 'tropa';
export type ProgressType = 'etapa' | 'especialidad';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: any;
  updatedAt?: any;
}

export interface Scout {
  id: string;
  parent_id: string;
  full_name: string;
  date_of_birth: string;
  section: ScoutSection;
  createdAt?: any;
  updatedAt?: any;
}

export interface Attendance {
  id: string;
  scout_id: string;
  date: string;
  is_present: boolean;
  recorded_by: string;
  createdAt?: any;
}

export interface Progress {
  id: string;
  scout_id: string;
  type: ProgressType;
  name: string;
  percentage: 0 | 25 | 50 | 75 | 100;
  last_updated_by: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt?: any;
  author_id: string;
  is_active: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  created_by: string;
  createdAt?: any;
}

export interface GroupFinance {
  id: string;
  balance: number;
  last_updated_at?: any;
  updated_by: string;
}
