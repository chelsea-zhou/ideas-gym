import express from 'express';
import  * as ChatController  from '../controllers/chatController';
import  * as StripeController  from '../controllers/stripeController';
import { requireAuth } from '@clerk/express'

const router = express.Router();
// Chat routes
router.post('/chats', requireAuth({}), ChatController.createChat);
router.put('/chats/:chatId', requireAuth({}),ChatController.updateChat);
router.get('/chats', requireAuth({}), ChatController.getChats);
router.get('/chats/:chatId', requireAuth({}), ChatController.getChatById);
router.put('/chats/:chatId/summary', requireAuth({}), ChatController.generateSummary);
router.delete('/chats/:chatId', requireAuth({}), ChatController.deleteChat);

// stripe routes
router.post('/stripe/create-checkout-session', requireAuth({}), StripeController.createCheckoutSession);
router.post('/stripe/create-portal-session', requireAuth({}), StripeController.createPortalSession);
router.post('/stripe/webhook', express.json({type: 'application/json'}), StripeController.receiveWebhookEvent);
export default router;
