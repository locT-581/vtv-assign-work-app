export interface Requirement {
  id: string;
  title: string;
  address: string;
  startDate: number;
  endDate: number;
  note?: string;
  supportTeams: SupportTeams[];
  userId: string;
  status: string;
}

export interface SupportTeams {
  id: string;
  team: string;
  members?: string[];
}
