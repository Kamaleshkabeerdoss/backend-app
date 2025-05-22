import './config/dbConfig';
import express from 'express';
import { swaggerUi, swaggerSpec } from './docs/swagger';
import multer from 'multer';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  let ipAddress =
    req.headers['cf-connecting-ip']?.toString() ||
    req.headers['x-real-ip']?.toString() ||
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'IP not found';


  if (ipAddress.startsWith('::ffff:')) {
    ipAddress = ipAddress.replace('::ffff:', '');
  }

  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;

  if (!ipv4Regex.test(ipAddress)) {
    ipAddress = 'IP not found';
  }

  (req as any).clientIp = ipAddress;
  console.log('Client IP:', ipAddress);

  next();
});

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('SQL Server is created and running!');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);


app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'fail',
        code: 400,
        error: 'File is too large. Maximum allowed size 5MB.'
      });
    }
    return res.status(400).json({
      status: 'fail',
      code: 400,
      error: err.message
    });
  }

  return res.status(500).json({
    status: 'fail',
    code: 500,
    error: err.message || 'Something went wrong!'
  });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});








