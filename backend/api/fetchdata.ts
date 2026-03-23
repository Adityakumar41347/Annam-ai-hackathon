import express, { type Request, type Response } from "express";
import ConnectDB

const app = express();

// Root route
app.get("/", async (req: Request, res: Response) => {
  try {
    await ConnectDB(); // connect once
    res.send("✅ Connected to DB");
  } catch (err) {
    console.error("❌ Failed to connect:", err);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});