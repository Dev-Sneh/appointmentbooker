export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  let date = new Date(0,0,0,10,30); // 10:30 AM
  while (date.getHours() < 19 || (date.getHours() === 19 && date.getMinutes() === 30)) {
    slots.push(date.toTimeString().slice(0,5));
    date = new Date(date.getTime() + 20 * 60000);
  }
  return slots;
}
