import { Request, Response } from "express";
import { db } from "../firebase/config";
import { CallDetails } from "../models/callModel";

const COLL = "calls";

export const getCallsByDate = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    if (!date) {
      res.status(400).json({ error: "Missing date" });
      return;
    }

    const dayOfWeek = new Date(date).getDay();

    const oneTimeSnap = await db.collection(COLL).where("date", "==", date).get();
    const recurringSnap = await db
      .collection(COLL)
      .where("recurring", "==", true)
      .where("dayOfWeek", "==", dayOfWeek)
      .get();

    const calls = [
      ...oneTimeSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as CallDetails) })),
      ...recurringSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as CallDetails) })),
    ];

    res.json(calls);
    return;
  } catch (err) {
    console.error("Error in getCallsByDate:", err);
    res.status(500).json({ error: "Failed to fetch calls" });
    return;
  }
};

export const addCall = async (req: Request, res: Response) => {
  try {
    const data = req.body as CallDetails;

    if (!data.date || !data.startTime || !data.duration || !data.client?.id) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const dayOfWeek = new Date(data.date).getDay();
    if (data.recurring) data.dayOfWeek = dayOfWeek;

    const baseDate = data.date;
    const newStart = new Date(`${baseDate}T${data.startTime}:00`);
    const newEnd = new Date(newStart.getTime() + data.duration * 60000);

    const [oneTimeSnap, recurringSnap] = await Promise.all([
      db.collection(COLL).where("date", "==", data.date).get(),
      db.collection(COLL).where("recurring", "==", true).where("dayOfWeek", "==", dayOfWeek).get(),
    ]);

    const allDocs = [...oneTimeSnap.docs, ...recurringSnap.docs];

    const hasOverlap = allDocs.some((doc) => {
      const existing = doc.data() as CallDetails;

      const exStart = new Date(`${baseDate}T${existing.startTime}:00`);
      const exEnd = new Date(exStart.getTime() + existing.duration * 60000);

      const overlap = !(newEnd <= exStart || newStart >= exEnd);
      const sameClient = existing.client?.id === data.client?.id;
      const sameDate = existing.date === data.date;

      return overlap || (sameClient && sameDate);
    });

    if (hasOverlap) {
      res.status(400).json({ error: "Time slot overlaps with another booking or already booked for this client" });
      return;
    }

    const docRef = await db.collection(COLL).add(data);
    res.status(201).json({ id: docRef.id });
    return;
  } catch (err) {
    console.error("Error in addCall:", err);
    res.status(500).json({ error: "Failed to add call" });
    return;
  }
};

export const deleteCall = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await db.collection(COLL).doc(id).delete();
    res.json({ success: true });
    return;
  } catch (err) {
    console.error("Error in deleteCall:", err);
    res.status(500).json({ error: "Failed to delete call" });
    return;
  }
};
