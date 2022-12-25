const router = require('express').Router();
const userController = require('../controller/userController');
const isAuth = require("../middleware/isAuth");

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.post('/findUser', isAuth, userController.findUser);
router.post('/addContact', isAuth, userController.addUserContacts);
router.post('/getContacts', isAuth, userController.getUserContacts);
router.post('/deleteContact', isAuth, userController.deleteContact);

router.post('/setUsername', isAuth, userController.setUsername);
router.post('/setAvatar', isAuth, userController.setAvatar);

module.exports = router;