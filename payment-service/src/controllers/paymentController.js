import { stripe } from '../index.js';
import Payment from '../models/Payment.js';
import CustomerMap from '../models/CustomerMap.js';

async function getOrCreateStripeCustomer({ userId, email }) {
    let mapping = await CustomerMap.findOne({ userId });
    if (mapping) return mapping.stripeCustomerId;

    const customer = await stripe.customers.create({
        metadata: { userId },
        email,
    });

    mapping = await CustomerMap.create({
        userId,
        stripeCustomerId: customer.id,
    });
    return mapping.stripeCustomerId;
}


const asyncHandler =
    (fn) =>
        (req, res, next) =>
            Promise.resolve(fn(req, res, next)).catch(next);


export const createSetupIntent = asyncHandler(async (req, res) => {
    const { userId, email } = req.user;

    const customerId = await getOrCreateStripeCustomer({ userId, email });

    const intent = await stripe.setupIntents.create({
        customer: customerId,
        usage: 'off_session',
    });

    return res.status(201).json({ clientSecret: intent.client_secret });
});


export const listPaymentMethods = asyncHandler(async (req, res) => {
    const customerId = await getOrCreateStripeCustomer(req.user);

    const { data } = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    });

    const methods = data.map((pm) => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        exp_month: pm.card.exp_month,
        exp_year: pm.card.exp_year,
    }));

    res.json({ paymentMethods: methods });
});


export const detachPaymentMethod = asyncHandler(async (req, res) => {
    const { paymentMethodId } = req.params;

    await stripe.paymentMethods.detach(paymentMethodId);

    res.json({ detached: true, paymentMethodId });
});


export const savePaymentMethod = asyncHandler(async (req, res) => {
    const { userId, email } = req.user;
    const { paymentMethodToken, billingDetails } = req.body;

    const customerId = await getOrCreateStripeCustomer({ userId, email });

    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodToken, {
        customer: customerId,
    });

    if (billingDetails) {
        await stripe.paymentMethods.update(paymentMethodToken, {
            billing_details: billingDetails,
        });
    }


    const { brand, last4, exp_month, exp_year } = paymentMethod.card;
    res.status(201).json({
        message: 'Payment method saved successfully.',
        paymentMethod: {
            paymentMethodId: paymentMethod.id,
            brand,
            last4,
            expMonth: exp_month,
            expYear: exp_year,
            default: false, 
        },
    });
});


export const setDefaultPaymentMethod = asyncHandler(async (req, res) => {
    const { userId, email } = req.user;
    const { id: paymentMethodId } = req.params;

    const customerId = await getOrCreateStripeCustomer({ userId, email });

    await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
    });

    res.json({ message: 'Default payment method updated.' });
});


export const createPayment = asyncHandler(async (req, res) => {
    const { userId, email } = req.user;
    const { orderId, amount, currency, paymentMethodId } = req.body;

    const customerId = await getOrCreateStripeCustomer({ userId, email });

    const intent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethodId,
        confirm: true,
        off_session: true,
        metadata: { orderId, userId },
    });

    const paymentDoc = await Payment.create({
        userId,
        orderId,
        paymentIntentId: intent.id,
        paymentMethodId,
        amount,
        currency: currency.toUpperCase(),
        status: intent.status,
        receiptUrl: intent.charges?.data?.[0]?.receipt_url ?? null,
    });

    res.status(201).json({ payment: paymentDoc.toJSON() });
});


export const listPayments = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const [payments, total] = await Promise.all([
        Payment.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Payment.countDocuments({ userId }),
    ]);

    res.json({
        page,
        total,
        payments: payments.map((p) => p.toJSON()),
    });
});


export const getPaymentById = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ _id: paymentId, userId });
    if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: payment.toJSON() });
});
