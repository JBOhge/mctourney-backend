const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.get('/me', authController.protectRoute, userController.getMe, userController.getUser);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.get('/loggedincheck', authController.isLoggedIn, authController.clientCheckLoggedIn);

//PROTECT ROUTE MIDDLEWARE
//AFFECTS EVERY ROUTE AFTER THIS
router.use(authController.protectRoute);

router.patch('/updatepassword', authController.updatePassword);
router.patch('/updateme', userController.updateMe);
router.delete('/deleteme', userController.deleteMe);

//RESTRICTS ROUTES AFTER TO ADMIN ONLY
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
