import prisma from '../clients/prismaClient';
import { Role } from '@prisma/client';


export async function createChatSession(userId: string) {
    if (!userId) {
      throw new Error('Missing required fields');
    }
    const chat = await prisma.chatSession.create({
      data: {
        userId,
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