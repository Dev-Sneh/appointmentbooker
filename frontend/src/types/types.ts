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
  date: string;              // required
  startTime: string;         // "HH:mm"
  duration: number;          // 20 or 40
  recurring: boolean;
  dayOfWeek?: number;        // 0–6 (if recurring)
}

