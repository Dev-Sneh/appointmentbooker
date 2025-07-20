import { Request, Response } from "express";
import db from "../firebase/config";

// Mock data as fallback
let mockCalls: any[] = [];

export const getCallsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    console.log("📅 Getting calls for date:", date);

    if (db) {
      // Use Firebase
      const snapshot = await db
        .collection("calls")
        .where("date", "==", date)
        .get();

      const calls = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json({ success: true, data: calls, source: "firebase" });
    } else {
      // Use mock data
      const filteredCalls = mockCalls.filter((call) => call.date === date);
      res.json({ success: true, data: filteredCalls, source: "mock" });
    }
  } catch (error) {
    console.error("Error fetching calls:", error);
    res.status(500).json({ success: false, error: "Failed to fetch calls" });
  }
};

export const addCall = async (req: Request, res: Response) => {
  try {
    const callData = req.body;
    console.log("💾 Adding call:", callData);

    if (db) {
      // Use Firebase
      const docRef = await db.collection("calls").add(callData);
      const newCall = { id: docRef.id, ...callData };
      res.status(201).json({ success: true, data: newCall, source: "firebase" });
    } else {
      // Use mock data
      const newCall = {
        ...callData,
        id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      mockCalls.push(newCall);
      res.status(201).json({ success: true, data: newCall, source: "mock" });
    }
  } catch (error) {
    console.error("Error creating call:", error);
    res.status(500).json({ success: false, error: "Failed to create call" });
  }
};

export const deleteCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Deleting call:", id);

    if (db) {
      // Use Firebase
      await db.collection("calls").doc(id).delete();
      res.json({ success: true, message: "Call deleted successfully", source: "firebase" });
    } else {
      // Use mock data
      const callIndex = mockCalls.findIndex((call) => call.id === id);
      if (callIndex === -1) {
        return res.status(404).json({ success: false, error: "Call not found" });
      }
      mockCalls.splice(callIndex, 1);
      res.json({ success: true, message: "Call deleted successfully", source: "mock" });
    }
  } catch (error) {
    console.error("Error deleting call:", error);
    res.status(500).json({ success: false, error: "Failed to delete call" });
  }
};
