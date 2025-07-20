import express from "express";
import cors from "cors";
import callRoutes from "./routes/callRoutes";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "https://appointbooker.netlify.app", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api", callRoutes);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("✅ API is running");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
