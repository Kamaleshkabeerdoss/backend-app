import express from 'express';
import { singleUpload, multipleUpload } from '../middlewares/upload';
import { authenticate } from '../middlewares/authMiddleware';
import * as userController from '../controllers/userController';
import { getLoginHistory } from '../controllers/loginHistoryController'; // adjust path if needed
import { checkRoles } from '../middlewares/checkRoles';

const router = express.Router();

// ---------------- User Routes ----------------

/**
 * @swagger
 * /users/login-history:
 *   get:
 *     summary: Get paginated login history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (10 records per page)
 *     responses:
 *       200:
 *         description: Login history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login history fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       ip_address:
 *                         type: string
 *                         example: 192.168.1.1
 *                       login_time:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-05-20T10:35:52.667Z
 *       401:
 *         description: Unauthorized - Login required
 *       500:
 *         description: Server error
 */


router.get('/login-history',authenticate,getLoginHistory);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */

router.get('/', authenticate,checkRoles('Admin','SuperAdmin','Manager'), userController.getAllUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */

router.get('/:id', authenticate, userController.getUserById);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: number
 *               mobileNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */

router.post('/', authenticate, userController.createUser);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated
 */

router.put('/:id', authenticate, userController.updateUser);
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Partially update user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User patched
 */

router.patch('/:id', authenticate, userController.patchUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */

router.delete('/:id', authenticate, userController.deleteUser);
/**
 * @swagger
 * /users/restore/{id}:
 *   post:
 *     summary: Restore deleted user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User restored
 */

router.post('/restore/:id', authenticate, userController.restoreUser);

// ---------------- Profile Route ----------------
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized — Token missing or invalid
 */

router.get('/profile', authenticate, userController.getUserProfile);

// ---------------- File Upload Routes ----------------

/**
 * @swagger
 * /users/upload-single:
 *   post:
 *     summary: Upload a single file
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

router.post('/upload-single', authenticate, singleUpload, userController.uploadFile);
/**
 * @swagger
 * /users/upload-multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */


router.post('/upload-multiple', authenticate, multipleUpload, userController.uploadMultipleFiles);


export default router;
