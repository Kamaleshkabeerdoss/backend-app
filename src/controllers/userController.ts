import * as userModel from '../services/userService';
import { Request, Response, RequestHandler } from 'express';
import { CustomRequest } from '../middlewares/authMiddleware';
import  User  from '../models/User'; 
import { data } from 'react-router-dom';

export const getAllUsers = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const users = await User.query().where({ isDeleted: false });

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'All users fetched successfully',
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      code: 500,
      message: 'Error fetching users',
      data: null,
    });
  }
};


// export async function getAllUsers(req: Request, res: Response) {
//   try {
//     const users = await userModel.getAllUsers();
//     res.status(200).json({
//       status: "success",
//       code: 200,
//       message: "Fetched all users",
//       data: users,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "fail",
//       code: 500,
//       message: "Error fetching users",
//       data: null,
//     });
//   }
// }

export const getUserById = async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ 
      status: 'fail',
      code: 401,
      message: 'Unauthorized',
      data: null,});
    return;
  }

  try {
    const user = await User.query().findById(req.user.userId);
    if (!user) {
      res.status(404).json({ 
        status:'fail',
        code: '404',
        message: 'User not found',
        data: null
       });
      return;
    }
    res.json({ 
      status: 'success', 
      code: 200,
      message: 'User found',
      data: user });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ 
      status: 'fail',
      code: 500,
      message: 'Server error',
      data: null });
  }
};

export async function createUser(req: Request, res: Response) {
  const { name, email, age, mobileNumber, address, gender, dateOfBirth } = req.body;
  try {
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        status: "fail",
        code: 409,
        message: "Email already exists",
        data: null,
      });
      return;
    }

    const newUser = await userModel.createUser(name, email, age, mobileNumber, address, gender, dateOfBirth);
    res.status(201).json({
      status: "success",
      code: 201,
      message: "User created",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Error creating user",
      data: null,
    });
  }
}

export const getUserProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ 
      status:'fail',
      code : 401,
      message: 'Unauthorized' ,
      data: null
    });
    return;
  }

  try {
    const userId = req.user.userId;
    // Fetch user by id from SQL Server via Objection.js
    const user = await User.query().findById(userId).select('id', 'name', 'email', 'age', 'mobileNumber', 'address', 'gender', 'dateOfBirth', 'isDeleted');

    if (!user) {
      res.status(404).json({ 
        status:'fail',
        code: 404,
        message: 'User not found',
        data: null });
      return;
    }
    
    res.json({
      status: 'success',
      code: 200,
      message: 'User Profile Found',
      data: user,
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ 
      status: 'fail',
      code: 500,
      message: 'Internal server error',
      data: null
     });
  }
};

export async function updateUser(req: Request, res: Response) {
  const { name, email, mobileNumber, address, gender, dateOfBirth } = req.body;
  try {
    const updatedUser = await userModel.updateUser(Number(req.params.id), name, email, mobileNumber, address, gender, dateOfBirth);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Error updating user",
      data: null,
    });
  }
}

export async function patchUser(req: Request, res: Response) {
  try {
    const updatedUser = await userModel.patchUser(Number(req.params.id), req.body);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User partially updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Error patching user",
      data: null,
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    await userModel.deleteUser(Number(req.params.id));
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User deleted",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Error deleting user",
      data: null,
    });
  }
}

export async function restoreUser(req: Request, res: Response) {
  try {
    await userModel.restoreUser(Number(req.params.id));
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User restored",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Error restoring user",
      data: null,
    });
  }
}

// file upload-multiple
export const uploadMultipleFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        status: "fail",
        code: 400,
        message: "No files uploaded",
        data: null,
      });
      return;
    }

    const filePaths = files.map(file => file.path);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Multiple files uploaded successfully",
      data: filePaths,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Error uploading files",
      data: null,
    });
  }
};
// single file upload
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        status: "fail",
        code: 400,
        message: "No file uploaded",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "File uploaded successfully",
      data: {
        fileName: file.filename,
        path: file.path,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Error uploading file",
      data: null,
    });
  }
};
