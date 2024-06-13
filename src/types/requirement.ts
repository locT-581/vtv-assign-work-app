import { User } from './user';

export interface Requirement {
  id: string;
  title: string;
  address: string;
  startDate: number;
  endDate: number;
  note?: string;
  supportTeams: SupportTeams[];
  user: string;
  status: RequirementStatus;
  reasonReject?: string;

  vehicles?: {
    type?: 'Xe taxi' | 'Xe cơ quan' | null;
    cars?: string[];
    drivers?: string[];
  };
  studioTechniques: { member: string[] } | null;
  lightingTechniques: { quantity: number; member: string[] };
  soundTechniques: { quantity: number; member: string[] };
  filming: { quantity: number; member: string[] };
  level: 'Cao' | 'Trung bình' | 'Thấp';

  km: string;
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

export type RequirementStatus = 'Đang chờ' | 'Đã phân công' | 'Đã từ chối' | 'Đã hoàn thành';
