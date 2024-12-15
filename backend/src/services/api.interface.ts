export interface  GetLlmRequest{
    userId: string;
    topic: string;
}

export interface  GetLlmResponse{
    userId: string;
    topic: string;
}

export interface CreateChatRequest {
  userId: string;
}
export interface UpdateChatRequest {
  chatId: string;
  message: string;
  userId: string;
}