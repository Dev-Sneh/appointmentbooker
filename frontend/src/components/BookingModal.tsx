import { useState, useEffect, useMemo } from "react";
import type { Client, CallDetails, CallType } from "../types/types";

interface BookingModalProps {
  slot: string;
  date: string;
  clients: Client[];
  existingCalls?: CallDetails[];
  onSave: (call: Omit<CallDetails, "id">) => void;
  onClose: () => void;
}

export default function BookingModal({
  slot,
  date,
  clients,
  existingCalls = [],
  onSave,
  onClose,
}: BookingModalProps) {
  const [clientId, setClientId] = useState("");
  const [type, setType] = useState<CallType>("onboarding");
  const [errorMessage, setErrorMessage] = useState("");

  const duration = type === "onboarding" ? 40 : 20;
  const start = new Date(`${date}T${slot}`);
  const end = new Date(start.getTime() + duration * 60000);

  // 🧠 Memoized list of available clients
  const availableClients = useMemo(() => {
    return clients.filter((client) => {
      const clientCalls = existingCalls.filter(c => c.client.id === client.id);
      return clientCalls.every((c) => {
        const callStart = new Date(`${c.date}T${c.startTime}`);
        const callEnd = new Date(callStart.getTime() + c.duration * 60000);
        return end <= callStart || start >= callEnd;
      });
    });
  }, [clients, existingCalls, slot, date, type]);

  useEffect(() => {
    if (availableClients.length > 0) {
      setClientId(availableClients[0].id);
    } else {
      setClientId("");
    }
  }, [availableClients]);

  const handleSave = () => {
    const client = availableClients.find((c) => c.id === clientId);
    if (!client) {
      setErrorMessage("⚠️ No available clients for this slot.");
      return;
    }

    const payload: Omit<CallDetails, "id"> = {
      client,
      type,
      startTime: slot,
      date,
      recurring: type === "follow-up",
      duration,
      dayOfWeek: type === "follow-up" ? new Date(date).getDay() : undefined,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg animate-fade-in">
        <h3 className="text-xl font-semibold mb-4">📞 Book @ {slot}</h3>

        <label className="block mb-1 font-medium">👤 Client</label>
        <select
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
            setErrorMessage("");
          }}
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          size={5}
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {availableClients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.phone})
            </option>
          ))}
        </select>

        <label className="block mb-1 font-medium">📍 Call Type</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as CallType);
            setErrorMessage("");
          }}
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="onboarding">Onboarding (40m)</option>
          <option value="follow-up">Follow‑up (20m)</option>
        </select>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!clientId}
            className={`px-4 py-2 text-white rounded ${clientId ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
