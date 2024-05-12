import { User } from './user';
import { Vehicle } from './vehicle.';

export interface Requirement {
  id: string;
  title: string;
  address: string;
  startDate: number;
  endDate: number;
  note?: string;
  supportTeams: SupportTeams[];
  user: User | null | undefined;
  status: RequirementStatus;
  reasonReject?: string;
  vehicles?: Vehicle[];
}

export interface SupportTeams {
  id: string;
  team: string;
  members?: User[];
}

export interface Department {
  id: string;
  name: string;
}

export type RequirementStatus = 'Đang chờ' | 'Đã phân công' | 'Đã từ chối' | '';
