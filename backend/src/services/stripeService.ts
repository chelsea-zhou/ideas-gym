import Stripe from 'stripe';
import { CreateSubscriptionRequest } from './api.interface';
import { stripeClient } from '../clients/stripeClient';

const priceId = 'price_1QWRK6AsXc0oXQzEi2xGAE2q';
const testPriceId = 'price_1QWRpkAsXc0oXQzE6HWFpUzv';

export async function createSubscription(req: CreateSubscriptionRequest) {
    try{
        const { email, paymentMethodId, priceId } = req;
        //const testPaymentMethodId = await createTestPaymentMethod();
    
        const existingCustomer = await stripeClient.findCustomerByEmail(email);
        let customer;
        if (existingCustomer) {
            customer = existingCustomer;
            console.log('found existing customer', customer);
        } else {
            customer = await stripeClient.createCustomer({
                email,
                paymentMethodId,
            });
            console.log('created new customer', customer);
        }
    
        const subscription = await stripeClient.createSubscription(customer.id, priceId);
        console.log('subscription', subscription.id);
        return subscription.id;
    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            console.error('Error creating subscription', error.message);
        } else {
            console.error('Error creating subscription', error);
        }
    }
}