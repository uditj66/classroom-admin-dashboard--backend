import express from "express";
import subjectrouter from "./routes/subject.js";
import cors from "cors";
const app = express();
if (!process.env.FRONTEND_URL)
  throw new Error(
    "Frontend Url is not configured in .env file .Please set the Frontend Url in your .env file"
  );

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const port = 8000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/subjects", subjectrouter);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
