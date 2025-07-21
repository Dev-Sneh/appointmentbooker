import type { CallDetails } from "../types/types";

const API = "http://localhost:5000/api";

export const getCallsForDate = async (date: string): Promise<CallDetails[]> => {
  const res = await fetch(`${API}/calls?date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch calls");
  return res.json();
};

export const addCall = async (call: Omit<CallDetails, "id">): Promise<void> => {
  const res = await fetch(`${API}/calls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(call),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to add");
  }
};

export const deleteCall = async (id: string): Promise<void> => {
  const res = await fetch(`${API}/calls/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
};
