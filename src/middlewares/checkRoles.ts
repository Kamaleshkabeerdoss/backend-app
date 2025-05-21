// middleware/checkRoles.ts
import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware'; // Import your custom Request type

export const checkRoles = (...allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({
        status: 'fail',
        code: 403,
        message: 'Access denied: insufficient permissions',
      });
      return;
    }

    next();//if user has valid role, proceed to next middleware or route handler
  };
};
