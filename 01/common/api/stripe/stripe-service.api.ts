import { StripeServiceApiConfigProvider } from '@inft-common/api/config/stripe-config.provider';
import { StripePaymentIntentData } from '@inft-common/api/stripe/interfaces/stripe-payment-intent-data.interface';
import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';


export interface StripeServiceApiConfig {
  publishableKey: string;
  secretKey: string;
}

@Injectable()
export class StripeServiceApi {
  public readonly stripe: Stripe;
  public readonly apiVersion = '2020-08-27';
  public readonly stripeConfig: StripeServiceApiConfig;

  constructor(private readonly stripeConfigProvider: StripeServiceApiConfigProvider) {
    this.stripeConfig = stripeConfigProvider.getConfig();
    this.stripe = new Stripe(this.stripeConfig.secretKey, { apiVersion: this.apiVersion });

    // this.createCustomer('demo@gmail.com', 'demo@gmail.com').then(console.log);
    // const customerId = 'cus_NohmUX1PoX7ecY';
    // this.getPaymentSheet(customerId, 1099).then(console.log);
    // this.blikPaymentIntent().then();
  }

  async createCustomer(name: string, email: string): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.stripe.customers.create({ name, email });
  }

  async getPaymentSheet(customerId: string, amount: number): Promise<StripePaymentIntentData> {
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
        { customer: customerId },
        { apiVersion: this.apiVersion }
    );
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'pln',
      customer: customerId,
      payment_method_types: ['card'],
      // automatic_payment_methods: { enabled: true },
      setup_future_usage: 'off_session',
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      publishableKey: this.stripeConfig.publishableKey,
    };
  }
}
