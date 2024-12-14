import express from 'express';
import  * as ChatController  from '../controllers/chatController';
import { requireAuth } from '@clerk/express'

const router = express.Router();

router.use(requireAuth());
// Chat routes
router.post('/chats', requireAuth({}), ChatController.createChat);
// router.put('/chats/:chatId', ChatController.updateChat);
// router.get('/chats', ChatController.getChats);
// router.get('/chats/:chatId', ChatController.getChatById);
// router.delete('/chats/:chatId', ChatController.deleteChat);

// User routes

export default router;
