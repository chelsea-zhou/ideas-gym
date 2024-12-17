import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUser(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId }
    });
}
export async function createUser(userId: string) {
    return await prisma.user.create({
        data: { id: userId }
    });
}
export async function updateUser(userId: string, stripeCustomerId: string) {
    console.log('updating user with stripe customer id:', stripeCustomerId);
    return await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: stripeCustomerId }
    });
}

export async function getChatsInfo(userId: string) {
    const chatsInfo = await prisma.chatSession.findMany({ 
        where: { userId },
        include: {
            _count: {
                select: { messages: true }
            }
    }
    });
    return chatsInfo;
}

export async function getChatDetailsById(chatId: string, userId: string) {
    const chat = await prisma.chatSession.findUnique({ 
        where: { id: chatId , userId: userId},
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
     });
    return chat;
}

export default prisma