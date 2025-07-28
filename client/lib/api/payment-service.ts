/**
 * src/lib/api/payment-service.ts
 * Fully aligned with the backend (Stripe) and the front‑end UI.
 */

import { paymentApi } from './api-client';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/** Card saved to the consumer (nested to match the UI) */
export interface PaymentMethod {
  id: string;            // Stripe pm_…
  card: {
    brand: string;       // Visa, MasterCard, ...
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault?: boolean;
}

/* Raw payload coming from the backend */
interface PaymentMethodRaw {
  paymentMethodId: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  isDefault?: boolean;
  default?: boolean;     // legacy field
}

interface PaymentMethodsResponse {
  paymentMethods: PaymentMethodRaw[];
}

/* SetupIntent helper */
export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
}

/* Payment DTOs ------------------------------------------------------------- */
export interface CreatePaymentDto {
  amount: number;          // in cents
  currency?: string;       // default CAD
  paymentMethodId: string; // pm_…
}

export interface RefundPaymentDto {
  amount?: number;
  reason?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentIntentId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: {
    brand: string;
    last4: string;
  };
}

interface PaymentResponse  { payment: Payment }
interface PaymentsResponse { payments: Payment[] }

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

class PaymentService {
  /* 0 — health (optional) */
  health() {
    return paymentApi.get<{ status: 'ok' | 'error' }>('/health');
  }

  /* 1 — Stripe SetupIntent */
  createSetupIntent() {
    return paymentApi.post<SetupIntentResponse>('/setup-intent');
  }

  /* 2 — Payment‑methods */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { paymentMethods } =
      await paymentApi.get<PaymentMethodsResponse>('/payment-methods');

    /* map backend ⇢ front‑end shape */
    return paymentMethods.map((pm): PaymentMethod => ({
      id: pm.paymentMethodId,
      card: {
        brand: pm.brand,
        last4: pm.last4,
        exp_month: pm.exp_month,
        exp_year: pm.exp_year,
      },
      isDefault: pm.isDefault ?? pm.default ?? false,
    }));
  }

  savePaymentMethod(paymentMethodToken: string) {
    return paymentApi.post<{ message: string; paymentMethod: PaymentMethodRaw }>(
      '/consumer/payment-methods',
      { paymentMethodToken }
    );
  }

  setDefaultPaymentMethod(paymentMethodId: string) {
    return paymentApi.put<{ message: string }>(
      `/consumer/payment-methods/${paymentMethodId}/default`
    );
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    await paymentApi.delete<void>(`/payment-methods/${paymentMethodId}`);
  }

  /* 3 — Payments */
  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const { amount, currency, paymentMethodId } = dto;
    const { payment } =
      await paymentApi.post<PaymentResponse>('/', { amount, currency, paymentMethodId });
    return payment;
  }

  async getPayments(page = 1, limit = 10): Promise<Payment[]> {
    const { payments } =
      await paymentApi.get<PaymentsResponse>(`/?page=${page}&limit=${limit}`);
    return payments;
  }

  getPayment(paymentId: string) {
    return paymentApi.get<Payment>(`/${paymentId}`);
  }

  refundPayment(paymentId: string, data?: RefundPaymentDto) {
    return paymentApi.post<{ message: string; refund: any }>(
      `/${paymentId}/refund`,
      data ?? {}
    );
  }
}

/* -------------------------------------------------------------------------- */

export const paymentService = new PaymentService();
