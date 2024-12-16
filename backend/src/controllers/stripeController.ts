
import * as StripeService from '../services/stripeService';
import { CreateSubscriptionRequest } from '../services/api.interface';
import { Request, Response } from 'express';

export async function createSubscription(req: Request, res: Response) {
    try {
        console.log('createSubscription', req.body);
        const { email, paymentMethodId, priceId } = req.body;
        const subscription = await StripeService.createSubscription({email, paymentMethodId, priceId});
        res.json({ subscription });
    } catch (error) {
        console.error('Error creating subscription', error);
        res.status(500).json({ message: 'Failed to create subscription' });
    }
}