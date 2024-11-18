export interface Award {
  award_id?: number;
  user_id: number;
  subject: string;
  company?: string;
  date?: Date;
  lang?: string;
}

export interface AwardResponse {
  success: boolean;
  data?: Award | Award[];
  message?: string;
}
