import crypto from 'crypto';
import { savePaymentLink, getPaymentLink, updatePaymentLink } from './database.js';

const SECRET_KEY = process.env.PAYMENT_SECRET || crypto.randomBytes(32).toString('hex');

export async function createPaymentLink(userEmail, plan, amount, books = []) {
  const linkId = crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${linkId}:${userEmail}:${plan}:${amount}`)
    .digest('hex');

  await savePaymentLink({
    linkId,
    userEmail,
    plan,
    amount,
    books,
    signature,
    status: 'pending',
    expiresAt: expiresAt.toISOString()
  });

  return linkId;
}

export async function verifyPaymentLink(linkId) {
  const link = await getPaymentLink(linkId);
  
  if (!link) return { valid: false, error: 'Invalid link' };
  if (new Date(link.expires_at) < new Date()) return { valid: false, error: 'Link expired' };
  if (link.status !== 'pending') return { valid: false, error: 'Link already used' };

  const expectedSig = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${link.link_id}:${link.user_email}:${link.plan}:${link.amount}`)
    .digest('hex');

  if (link.signature !== expectedSig) return { valid: false, error: 'Invalid signature' };

  return { 
    valid: true, 
    link: {
      linkId: link.link_id,
      userEmail: link.user_email,
      plan: link.plan,
      amount: link.amount,
      books: JSON.parse(link.books || '[]'),
      expiresAt: link.expires_at
    }
  };
}

export async function markPaymentComplete(linkId) {
  await updatePaymentLink(linkId, 'completed', new Date().toISOString());
  return true;
}

export async function activateSubscription(linkId) {
  const link = await getPaymentLink(linkId);
  
  if (!link || link.status !== 'completed') return null;

  const durationDays = link.plan === 'weekly_unlimited' ? 14 : 30;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  return {
    userEmail: link.user_email,
    plan: link.plan,
    books: JSON.parse(link.books || '[]'),
    expiresAt: expiresAt.toISOString()
  };
}
