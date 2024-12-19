import { openAIClient } from '../clients/llmClient';
import prisma, { createMessage, getChatDetailsById, getChatsInfo } from '../clients/prismaClient';
import { Role } from '@prisma/client';

// todo: move to api.interface.ts
export interface CreateChatRequest {
  userId: string;
}
export interface UpdateChatRequest {
  chatId: string;
  message: string;
  userId: string;
}

export interface GetChatsRequest {
  userId: string;
}

export interface GetChatByIdRequest {
  userId: string;
  chatId: string;
}

export async function createChatSession(req: CreateChatRequest) {
  const { userId } = req;
  if (!userId) {
    throw new Error('Missing required fields');
  }
  await openAIClient.createThread();
  const threadId = openAIClient.getThreadId();
  console.log(`created thread:`, threadId);
  const chat = await prisma.chatSession.create({
    data: {
      userId,
      threadId,
      messages: {
        create: {
          role: Role.ASSISTANT,
          content: 'Hey there! How can I help you today?'
        }
      }
    }
  });
  return chat;
}

const getElapsedTime = (createdAt: Date) => {
  const elapsedTime = Math.floor((new Date().getTime() - createdAt.getTime()) / 60000);
  const elapsedTimeString = `[${elapsedTime.toString().padStart(2, '0')}:00]`;
  return elapsedTimeString;
}

export async function updateChat(req: UpdateChatRequest) {
  const { chatId, userId, message } = req;
  if (!chatId || !userId || !message) {
    throw new Error('Missing required fields');
  }

  const chatSession = await prisma.chatSession.findUnique({ where: { id: chatId } });
  if (!chatSession) {
    throw new Error('Chat session not found');
  }
  if (chatSession.userId !== userId) { 
    throw new Error('Unauthorized');
  }
  const threadId = chatSession.threadId;
 
  // insert user message into db
  await createMessage(message, chatId, Role.USER);
  const elapsedTimeString = getElapsedTime(chatSession.createdAt);
  const messageWithElapsedTime = `${elapsedTimeString} ${message} `;
  
  // get assistant response
  const response = await openAIClient.sendMessage(threadId, messageWithElapsedTime);
  const assistantMessage = response.text.value;
  console.log(`got assistant message:`, assistantMessage);

  // insert assistant message into db
  await createMessage(assistantMessage, chatId, Role.ASSISTANT);
  return assistantMessage;
}

export async function getChats(req: GetChatsRequest) {
  const { userId } = req;
  if (!userId) {
    throw new Error('Missing required fields');
  }
  const chats = await getChatsInfo(userId);
  const result = chats.map((chat) => {
    return {
      ...chat,
      messageCount: chat._count.messages
    }
  });
  return result;
}

export async function getChatById(req: GetChatByIdRequest) {
  const { chatId, userId } = req;
  const chat = await getChatDetailsById(chatId, userId);
  return chat;
}

export async function generateSummary(req: GetChatByIdRequest) {
  const { chatId } = req;
  const chat = await prisma.chatSession.findUnique({ where: { id: chatId } });
  if (!chat) {
    throw new Error('Chat session not found');
  }
  if (!chat.summary) {
    const summary = await openAIClient.summarizeThread(chat.threadId);
    if (summary) {
      await prisma.chatSession.update({
        where: { id: chatId },
        data: { 
          title: summary.title,
          topic: summary.topics.join(', ')
        }
      });
    }
  }
  return chat?.summary;
}