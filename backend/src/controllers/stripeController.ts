
import * as StripeService from '../services/stripeService';
import { CreateSubscriptionRequest } from '../services/api.interface';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getAuth } from '@clerk/express';
import { getUser, updateUser } from '../clients/prismaClient';

const testStripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
});

  // maybe a dedicated API just to get user to verify if they are subscribed
const isUserSubscribed = async (userId: string) => {
    const user = await getUser(userId);
    return user?.stripeCustomerId !== null;
}

export async function createCheckoutSession(req: Request, res: Response) {
    const { userId } = await getAuth(req);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    console.log('lookup_key:', req.body.lookup_key);
    const prices = await testStripeClient.prices.list({
        lookup_keys: [req.body.lookup_key],
        expand: ['data.product'],
      });
    //console.log('retrieved prices:', prices);
    const session = await testStripeClient.checkout.sessions.create({
        line_items: [
          {
            price: prices.data[0].id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.YOUR_DOMAIN}/stripe?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.YOUR_DOMAIN}/stripe?canceled=true`,
        automatic_tax: {enabled: true},
    });
    console.log('created session:', session.id);
    res.json({ url: session.url });
}

export async function createPortalSession(req: Request, res: Response) {
  const { customerId } = req.body;
  const returnUrl = process.env.YOUR_DOMAIN!;
  const portalSession = await testStripeClient.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  console.log('created portal session:', portalSession);

  res.json({ url: portalSession.url });
}