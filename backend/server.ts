import express from "express";
import cors from "cors";
import callRoutes from "./routes/callRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api", callRoutes);

app.get("/", (req, res) => res.send("✅ API is running"));
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
