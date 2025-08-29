import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import './firebase'; // Initialize Firebase Admin

const app = express();

// Middlewares
app.use(cors({ origin: '*' })); // Allow all origins for now
app.use(express.json());

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Neeiz API is running!' 
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 API Server is listening on port ${PORT}`);
});
