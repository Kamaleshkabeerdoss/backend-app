// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../utils/tokenBlacklist';
// import { data } from 'react-router-dom';

interface JwtPayload {
  userId: number;
  name: string;
  email: string;
  role : string;
  jti: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      status: 'fail',
      code: 401,
      message: 'No token' ,
      data: null
    });
    return;  // Just return void here, not `return res.status(...);`
  }

  const token = authHeader.split(' ')[1];

  if (tokenBlacklist.has(token)) {
    res.status(401).json({ 
      status: 'fail',
      code: 401,
      message: 'Token is Expired. Please login again.' ,
      data: null 
    });
    return;  // return void
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();  // calling next() and do NOT returning anything here
  } catch (err) {
    res.status(401).json({ 
      status: 'fail',
      code: 401,
      message: 'Invalid token',
      data: null
    });
    return;  // return void
  }
};



