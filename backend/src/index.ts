import 'dotenv/config'
import express, { Request, Response } from "express";
import cors from 'cors';
import { clerkMiddleware, getAuth, requireAuth } from '@clerk/express'

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Public route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

// Protected route example
app.get("/chats", requireAuth({}),(req: Request, res: Response) => {
    const {userId} = getAuth(req);
    res.json({ message: "return chat history", userId: userId });
});

app.get("/chat/:chatId", requireAuth({}),(req: Request, res: Response) => {
    const {userId} = getAuth(req);
    res.json({ message: "return chat history", userId: userId });
});

// Protected chat routes
app.post("/chat", requireAuth(),  (req, res) => {
    const { message } = req.body;
    const {userId} = getAuth(req);

    if (!message) {
      res.status(400).json({ error: "Message is required" });
    }

    // TODO: Add your chat processing logic here
     res.json({
      success: true,
      message,
      userId: userId,
      timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
