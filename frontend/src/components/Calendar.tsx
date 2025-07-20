import { useState, useEffect } from "react";
import BookingModal from "./BookingModal";
import { generateTimeSlots } from "../hooks/useSlots";
import type { CallDetails, Client } from "../types/types";
import * as api from "../services/callService";

interface Props {
  date: string;
  clients: Client[];
  onRefresh?: () => void;
}

export default function Calendar({ date, clients, onRefresh }: Props) {
  const [calls, setCalls] = useState<CallDetails[]>([]);
  const [slot, setSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getCallsForDate(date);
      setCalls(data);
    } catch (err) {
      setErrorMsg("Error loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

  const handleSave = async (call: Omit<CallDetails, "id">) => {
    try {
      await api.addCall(call);
      load();
      onRefresh?.();
    } catch (err: any) {
      setErrorMsg(err.message || "Booking failed");
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleDel = async (id: string) => {
    try {
      await api.deleteCall(id);
      load();
      onRefresh?.();
    } catch (err) {
      setErrorMsg("Failed to delete booking.");
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const slots = generateTimeSlots();

  const isBooked = (slot: string) => {
    const st = new Date(`${date}T${slot}:00`);
    return calls.some((c) => {
      const s = new Date(`${c.date}T${c.startTime}:00`);
      const e = new Date(s.getTime() + c.duration * 60000);
      return st < e && new Date(st.getTime() + 60000) > s;
    });
  };

  const isPastDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return date < today;
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow space-y-3">
      <h2 className="text-xl font-semibold text-center mb-3">
        📅 Schedule for {date}
      </h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded">
          ⚠️ {errorMsg}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        slots.map((slotTime) => {
          const bookedCall = calls.find((c) => c.startTime === slotTime);
          const occupied = Boolean(bookedCall);

          return (
            <div
              key={slotTime}
              className={`flex justify-between items-center p-2 rounded ${
                occupied ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <span>{slotTime}</span>
              {occupied ? (
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    {bookedCall!.client.name} ({bookedCall!.type})
                  </span>
                  {!isPastDate() && (
                    <button
                      onClick={() => handleDel(bookedCall!.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ) : isPastDate() ? (
                <span className="text-gray-500 text-sm">—</span>
              ) : (
                <button
                  onClick={() => {
                    if (isBooked(slotTime)) {
                      setErrorMsg("Slot already booked by someone else.");
                      setTimeout(() => setErrorMsg(null), 3000);
                      return;
                    }
                    setSlot(slotTime);
                  }}
                  className="text-green-600 hover:underline text-sm"
                >
                  + Book
                </button>
              )}
            </div>
          );
        })
      )}

      {slot && (
        <BookingModal
          date={date}
          slot={slot}
          clients={clients}
          existingCalls={calls}
          onSave={handleSave}
          onClose={() => setSlot(null)}
        />
      )}
    </div>
  );
}
