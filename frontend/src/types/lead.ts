export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "lost";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export interface LeadNote {
  id: number;
  leadId: number;
  content: string;
  createdAt: string;
}
