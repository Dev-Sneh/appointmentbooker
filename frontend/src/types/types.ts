export interface Client {
  id: string;
  name: string;
  phone: string;
}

export type CallType = "onboarding" | "follow-up";

export interface CallDetails {
  id?: string;
  client: {
    id: string;
    name: string;
  };
  type: "onboarding" | "follow-up";
  date: string;              
  startTime: string;        
  duration: number;          
  recurring: boolean;
  dayOfWeek?: number;        
}

