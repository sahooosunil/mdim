import express from 'express';
import * as ctrl from '../controllers/authController.js';
import auth from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';

const router = express.Router();  // ✅ FIXED

router.post('/signup', ctrl.signup); // protect if only admin can create users
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', auth, ctrl.me);
router.get('/all-users', auth, requireRole("ADMIN"), ctrl.getAllUsers);
router.post("/change-user-role", auth, requireRole("ADMIN"), ctrl.changeRoleOfUsers);

export default router;
