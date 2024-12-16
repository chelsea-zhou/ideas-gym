export interface  GetLlmRequest{
    userId: string;
    topic: string;
}

export interface  GetLlmResponse{
    userId: string;
    topic: string;
}

export interface CreateSubscriptionRequest {
    email: string;
    paymentMethodId: string;
    priceId: string;
}