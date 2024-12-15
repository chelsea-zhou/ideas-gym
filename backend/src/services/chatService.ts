import { openAIClient } from '../clients/llmClient';
import prisma from '../clients/prismaClient';
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