import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { router } from './routes/route';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use('/', router)

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
})