export interface CallDetails {
  id?: string;
  client: { id: string; name: string };
  type: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // "HH:mm"
  duration: number;    // 20 or 40
  recurring: boolean;
  dayOfWeek?: number;  // 0–6 (Sun–Sat)
}
