import type { CallDetails } from "../types/types";

const API = import.meta.env.VITE_API_URL;


export const getCallsForDate = async (date: string): Promise<CallDetails[]> => {
  const res = await fetch(`${API}/calls?date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch calls");
  return res.json();
};

// export const addCall = async (call: Omit<CallDetails, "id">): Promise<void> => {
//   const res = await fetch(`${API}/calls`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(call),
//   });
//   if (!res.ok) {
//     const { error } = await res.json();
//     throw new Error(error || "Failed to add");
//   }
// };
export const addCall = async (call: Omit<CallDetails, "id">): Promise<void> => {
  console.log("📤 Payload going to backend:", call);
  const res = await fetch(`${API}/calls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(call),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("❌ Backend error:", result.error);
    throw new Error(result.error || "Failed to add call");
  }
};



export const deleteCall = async (id: string): Promise<void> => {
  const res = await fetch(`${API}/calls/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
};
