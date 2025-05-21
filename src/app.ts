import './config/dbConfig';
import express from 'express';
import { swaggerUi, swaggerSpec } from './docs/swagger';
import multer from 'multer';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'; // use correct path
import cors from 'cors';
// app.use(cors());

const app = express();
// ✅ Tell Express to trust proxy headers (important for getting real IPs)
app.set('trust proxy', true);
app.use(express.json());
app.use(cors());

//swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('SQL Server is created and running!');
});
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
const PORT = process.env.PORT || 3000;

app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        status: 'fail',
        code: 400,
        error: 'File is too large. Maximum allowed size 5MB.' });
    }
    return res.status(400).json({ 
      status: 'fail',
      code: 400,
      error: err.message });
  }

  // default error handler
  return res.status(500).json({ 
    status: 'fail',
    code: 500,
    error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

