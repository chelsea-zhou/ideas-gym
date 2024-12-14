import 'dotenv/config'
import express from "express";
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'
import routes from './routes';
import { requestLogger } from './middleware/requestLogger';

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use(requestLogger);
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
