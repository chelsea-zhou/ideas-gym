import { getAuth } from '@clerk/express';
import  * as ChatService  from '../services/chatService';
import { Request, Response } from 'express';
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream';

export async function createChat(req: Request, res: Response) {
    try {
        console.log("create chat called");
        const { userId } = await getAuth(req);
        console.log("userid is", userId);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const chat = await ChatService.createChatSession({userId});
        console.log("new chat is", chat);
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Please sign in to start a chat' });
    }
}

export async function updateChat(req: Request, res: Response) {
    try {
        const {chatId} = req.params;
        const { userId } = await getAuth(req);
        const { message } = req.body;
        const chat = await ChatService.updateChat({
            chatId,
            userId: userId!,
            message
        });
        res.json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to update chat" });
    }
}

// export async function deleteChat(req, res) {
//     try {
//     const { userId, topic } = req.body;
//     const chat = await chatService.deleteChat(userId, topic);
//     res.status(201).json(chat);
//     } catch (error) {
//     res.status(500).json({ error: error.message });
//     }
// }

export async function getChats(req: Request, res: Response) {
    try {
        const { userId } = await getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const chatsInfo = await ChatService.getChats({userId});
        console.log("chatsInfo are", chatsInfo);
        res.json({
            chatInfo: chatsInfo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to get chats" });
    }
}

export async function getChatById(req: Request, res: Response) {
    try {
        const { chatId} = req.params;
        const { userId } = await getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!chatId) {
            res.status(400).json({ error: 'Missing chatId' });
            return;
        }
        const chat = await ChatService.getChatById({chatId, userId});
        console.log("chat is", chat);
        res.json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}