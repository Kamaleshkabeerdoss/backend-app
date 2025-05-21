import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerValidationSchema, loginValidationSchema } from '../validations/validateUser';
import { tokenBlacklist } from '../utils/tokenBlacklist';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import LoginHistory from '../models/LoginHistory';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

// REGISTER
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await registerValidationSchema.validate(req.body);
    const existingUser = await User.query().findOne({ email: req.body.email });

    if (existingUser) {
      res.status(400).json({ 
        status: 'fail',
        code: 400,
        message: 'User already exists',
        data: null
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.query().insert({
      ...req.body,
      password: hashedPassword,
      isDeleted: false,
    });

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      code: 400,
      message: err.message,
      data: null,
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await loginValidationSchema.validate(req.body);
    const user = await User.query().findOne({ name: req.body.name, isDeleted: false });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        code: 404,
        message: 'User not found',
        data: null,
      });
      return;
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res.status(401).json({
        status: 'fail',
        code: 401,
        message: 'Invalid credentials',
        data: null,
      });
      return;
    }
 //  Login History
    let ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';

    if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
      ipAddress = '127.0.0.1';
}

const loginTimeIST = new Date().toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
});
    await LoginHistory.query().insert({
      
      user_id: user.id,
      ip_address: ipAddress,
      login_time: new Date(), // use current timestamp
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        jti: uuidv4(),
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Login successful',
      data: { token },
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      code: 400,
      message: err.message,
      data: null,
    });
  }
};

// LOGOUT
export const logout = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    tokenBlacklist.add(token);
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Logged out successfully',
    data: null,
  });
  return;
};

