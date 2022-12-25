const router = require('express').Router();
const chatController = require('../controller/chatController');
const isAuth = require('../middleware/isAuth');

router.post('/sendChat', isAuth, chatController.SendChat);
router.post('/getChat', isAuth, chatController.GetChats);
router.post('/updateChat', isAuth, chatController.UpdateChat);

// router.post('/updateAll', isAuth, chatController.UpdateAll);

module.exports = router;