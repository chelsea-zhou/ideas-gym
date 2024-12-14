import { getAuth } from '@clerk/express';
import  * as ChatService  from '../services/chatService';
import { Request, Response } from 'express';

export interface CreateChatRequest extends Request {
    userId: string;
}

export async function createChat(req: Request, res: Response) {
    try {
        const { userId } = await getAuth(req);
        console.log(userId);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const chat = await ChatService.createChatSession(userId);
        console.log(chat);
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Please sign in to start a chat' });
    }
}

// export async function updateChat(req, res) {
//     try {
//     const { userId, topic } = req.body;
//     const chat = await chatService.updateChat(userId, topic);
//     res.status(201).json(chat);
//     } catch (error) {
//     res.status(500).json({ error: error.message });
//     }
// }

// export async function deleteChat(req, res) {
//     try {
//     const { userId, topic } = req.body;
//     const chat = await chatService.deleteChat(userId, topic);
//     res.status(201).json(chat);
//     } catch (error) {
//     res.status(500).json({ error: error.message });
//     }
// }

// export async function getChats(req, res) {
//     try {
//     const { userId, topic } = req.body;
//     const chat = await chatService.getChats(userId, topic);
//     res.status(201).json(chat);
//     } catch (error) {
//     res.status(500).json({ error: error.message });
//     }
// }

// export async function getChatById(req, res) {
//     try {
//     const { userId, topic } = req.body;
//     const chat = await chatService.getChatById(userId, topic);
//     res.status(201).json(chat);
//     } catch (error) {
//     res.status(500).json({ error: error.message });
//     }
// }