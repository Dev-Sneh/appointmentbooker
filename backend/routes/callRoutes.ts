import { Router } from "express";
import { getCallsByDate, addCall, deleteCall } from "../controllers/callController";

const router = Router();
router.get("/calls", getCallsByDate);
router.post("/calls", addCall);
router.delete("/calls/:id", deleteCall);


export default router;
