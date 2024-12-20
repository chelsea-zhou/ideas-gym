import { getAuth } from '@clerk/express';
import  * as ChatService  from '../services/chatService';
import { Request, Response } from 'express';
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream';
import { createUser, getUser } from '../clients/prismaClient';

export async function createChat(req: Request, res: Response) {
    try {
        console.log("create chat called");
        const { userId } = await getAuth(req);
        console.log("userid is", userId);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await getUser(userId);
        if (!user) {
            await createUser(userId);
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

export async function deleteChat(req: Request, res: Response) {
    try {
        const {chatId} = req.params;
        const { userId } = await getAuth(req);
        const chat = await ChatService.deleteChat({chatId: chatId!, userId: userId!});
        res.json(chat);
    } catch (error) {
        res.json({ error: "failed to delete chat" });
    }
}

export async function getChats(req: Request, res: Response) {
    try {
        const { userId } = await getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const chatsInfo = await ChatService.getChats({userId});
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

export async function generateSummary(req: Request, res: Response) {
    try {   
        const { chatId } = req.params;
        const { userId } = await getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!chatId) {
            res.status(400).json({ error: 'Missing chatId' });
            return;
        }
        const summary = await ChatService.generateSummary({ chatId, userId });
        res.json(summary);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
}