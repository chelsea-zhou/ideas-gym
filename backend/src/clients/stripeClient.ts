import Stripe from 'stripe';

interface CustomerDetails {
    email: string;
    paymentMethodId: string;
}

const testPriceId = 'price_1QWRpkAsXc0oXQzE6HWFpUzv';

export class StripeClient {
  private client: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    this.client = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    });
  }

  public async findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const customers = await this.client.customers.list({
      email,
      limit: 1
    });
    return customers.data[0] || null;
  }

  public async createCustomer(details: CustomerDetails): Promise<Stripe.Customer> {
    return await this.client.customers.create({
      email: details.email,
      payment_method: details.paymentMethodId,
      invoice_settings: { 
        default_payment_method: details.paymentMethodId 
      },
    });
  }

  public async attachPaymentMethod(
    customerId: string, 
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    return await this.client.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async findActiveSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription | null> {
    const subscriptions = await this.client.subscriptions.list({
      customer: customerId,
      price: priceId,
      status: 'active',
      limit: 1
    });
    return subscriptions.data[0] || null;
  }

  async createSubscription(
    customerId: string, 
    priceId: string
  ): Promise<Stripe.Subscription> {
    const existingSubscription = await this.findActiveSubscription(customerId, priceId);
    if (existingSubscription) {
      throw new Error('Customer already has an active subscription for this price');
    }
    return await this.client.subscriptions.create({
      customer: customerId,
      items: [{ price: testPriceId }],
    });
  }
}

// Singleton instance
export const stripeClient = new StripeClient();