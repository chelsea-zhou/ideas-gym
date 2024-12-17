import { openAIClient } from '../clients/llmClient';
import prisma, { getChatDetailsById, getChatsInfo } from '../clients/prismaClient';
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
  // call openai api to get response
  const response = await openAIClient.sendMessage(threadId, message);
  const assistantMessage = response.text.value;
  console.log(`got assistant message:`, assistantMessage);

  const createDateTime = new Date(chatSession.createdAt);
  createDateTime.setMinutes(createDateTime.getMinutes() + 2);
  if (new Date() > createDateTime && !chatSession.title) {
    console.log('Conversation is 2 minutes after start');
    const summary = await openAIClient.summarizeThread(threadId);
    console.log(`got summary:`, summary);
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

  await prisma.message.create({
    data: {
      role: Role.ASSISTANT,
      content: assistantMessage,
      chatSessionId: chatId
    }
  });

  await prisma.message.create({
    data: {
      role: Role.USER,
      content: message,
      chatSessionId: chatId
    }
  });

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