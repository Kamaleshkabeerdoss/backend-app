// middleware/checkRoles.ts
import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware';
import db from '../config/dbConfig'; // your knex instance

export const checkPermission = () => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(403).json({
          status: 'fail',
          code: 403,
          message: 'Access denied: user not authenticated',
        });
        return;
      }

      const result = await db('Users')
        .select('isPermission')
        .where({ id: userId })
        .first();

      if (!result || !result.isPermission) {
        res.status(403).json({
          status: 'fail',
          code: 403,
          message: 'Access denied: insufficient permissions',
        });
        return;
      }

      next(); // User has permission, continue
    } catch (err) {
      console.error('Permission check error:', err);
      res.status(500).json({
        status: 'fail',
        code: 500,
        message: 'Server error while checking permissions',
      });
    }
  };
};
