// models/userModel.ts
import User from '../models/User'; 

// Get all users (not deleted)
export async function getAllUsers() {
  try {
    return await User.query().where('isDeleted', false);
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}
export async function getUserByEmail(email: string) {
  return User.query().where('email', email).andWhere('isDeleted', false).first();
}

// Get one user by ID (not deleted)
export async function getUserById(id: number) {
  return User.query()
    .where('id', id)
    .andWhere('isDeleted', false)
    .first();
}

// Create a new user
export async function createUser(
  name: string,
  email: string,
  age: number,
  mobileNumber: string,
  address: string,
  gender: string,
  dateOfBirth: string
) {
  return User.query().insert({
    name,
    email,
    age,
    mobileNumber,
    address,
    gender,
    dateOfBirth,
    isDeleted: false,
  });
}

// Update existing user
export async function updateUser(
  id: number,
  name: string,
  email: string,
  mobileNumber: string,
  address: string,
  gender: string,
  dateOfBirth: string
) {
  return User.query()
    .patch({
      name,
      email,
      mobileNumber,
      address,
      gender,
      dateOfBirth,
    })
    .where('id', id)
    .where('isDeleted', false);
}

// Patch user fields dynamically
export async function patchUser(
  id: number,
  fields: {
    name?: string;
    email?: string;
    mobileNumber?: string;
    address?: string;
    gender?: string;
    dateOfBirth?: string;
  }
) {
  return User.query().patch(fields).where('id', id).where('isDeleted', false);
}

// Soft delete user
export async function deleteUser(id: number) {
  return User.query().patch({ isDeleted: true }).where('id', id);
}

// Restore soft-deleted user
export async function restoreUser(id: number) {
  return User.query().patch({ isDeleted: false }).where('id', id);
}
