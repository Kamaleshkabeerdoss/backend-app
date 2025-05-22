// middleware/checkRoles.ts
import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware';
import db from '../config/dbConfig'; // knex instance

export const checkPermission = (requiredPermission: string) => {
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

      // Step 1: Get the user's role
      const user = await db('users')
        .select('role')
        .where({ id: userId })
        .first();

      if (!user) {
        res.status(403).json({
          status: 'fail',
          code: 403,
          message: 'User not found',
        });
        return;
      }

      // Step 2: Get the role ID from roles table
      const roleRecord = await db('roles')
        .select('id')
        .where({ role_name: user.role }) 
        .first();

      if (!roleRecord) {
        res.status(403).json({
          status: 'fail',
          code: 403,
          message: 'Role not found',
        });
        return;
      }

      // ✅ Step 3: Check if role has required permission (FIXED .where syntax)
      const hasPermission = await db('RolePermissions')
        .join('Permissions', 'RolePermissions.permission_id', 'Permissions.id')
        .where('RolePermissions.role_id', roleRecord.id)
        .andWhere('Permissions.permission_name', requiredPermission)
        .first();


      if (!hasPermission) {
        res.status(403).json({
          status: 'fail',
          code: 403,
          message: 'Access denied: insufficient permissions',
        });
        return;
      }

      next(); // ✅ Has permission, allow
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
