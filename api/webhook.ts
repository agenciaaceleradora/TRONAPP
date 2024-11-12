import { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';

const serviceAccount = {
  type: "service_account",
  project_id: "tron-app-339ef",
  private_key_id: "346ef5ce2752cde2ca11352fa8677d0b27573a5d",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDq/PNUMugBAk7T\nSKctaxmwO0swh2qep+HlSF7DStsrEhfgdPlVg6pwZTPnNgAACw3wEpe174C4CXaI\nICzmgyxkH6jkZNW1nVz0nI5dkiRMTN9sKsge6WI6Ilffs1bFYKhO5N229VCHEDjN\nnPswgj+OEIyCDegAyw7FPmhymexJiQha7TSn5H8AUD1XTFpCLs1zb0H3yzgTj/H/\n3JZi7qnpmn+K0+RcSO/DkMrk9MiBqgf9J/iUzwJIV1JxafLJII+FIhRaXpoohmHf\nYVcRcL/UZPE308zHz+BJ466gGXoSA0sMRiVu3hUVhfeqK0EuhDuEzvgMgtGdyOuj\nqK/5UDGtAgMBAAECggEABSbN+9TQ3sLK8RlY5uc/7SvjmlkBpqBGFMV5JF1mACP5\np4dQ9wW3rRae5Gz744Rahh6WOlwZjY9RjKrt6RDLnpdOF9G5GK3uPYOYIGeFibGu\nvTuT3w+dQmqB1Crlllan4fDlBm+K2CcsI5/TJu1YENh+iBRfd3L8LClR119V/Yer\nh/9+tNvoGsIPw5D5Qu9wsWKeElRNT6p1Nowx0gO+dY+xOojydtip3yV5Uvffh1te\nHXOZvuYH9c/4+1PnORfNMpAwpJGLl1rDuDyOqtW5u8bLupnfry0wN9TqmTQS0+KJ\nAeLGfs9F5hRACWFtnGAz1x77A3D2RQ7T1DJstLhwsQKBgQD7tGmEJ+Ywsh3Cy+mS\n2qgVQbF9Y835lLKHMYMpS7vDLUlWX0ENoeRPnSDJQZJ8+ZmFQfdC8qLoAnzz673+\nfuCiVpkx4sf2jwD2rx4SjTcsq2DsSjvI8diReXUZN0adfRDSIetsy8Ft9r68sEWc\ndroCObXkmQk3toMlewH0ibiPcQKBgQDu/4K3sp7xCyCcu3O8mJ+Y6Qh6PfNrUER4\nqJd0zd3Hz8GV0ci9BJUNOulDWjS533rvAfp2jtXBTMT60k8/Qon/YVYFp/mturA2\nlKmPXwyHFpGgc/e8YG894i5ziK/uzuFMEp4BXSxLprP3YM1eMZCLSZ2HXv0a24o3\nHtnMSuff/QKBgQCoujuxV327TuscVczxoJnkBfGQ+IJut/slHU+rMxVetNDgkWHu\nXYPKyq3bu5UTKc57wcianEQP+vsAGBt4qlyy9hIjmr4ozZv7wVALZ5aA3zFNtEV3\nYoemnSCeEqvHjrrj4dELUVsM98bMfe1sATqXm1APOXcwXax0R4z7/AY4QQKBgQCm\nO/Kf8w26exLj8T4/H6liojPTUuPM8LevdRRjmg14vXjYzGHjlxxVZ3R39HZYEqlf\nNPERJahoGw2nqECWr6FskDdVF9EClaebTyvhHSuJipkgEYlu7WRylq/YjGpSoHL0\nhr6AFF6LABiNKDewHKl9OGbpkZha5fjs/fhfsHo3wQKBgGFRMjd1Xmkyy4AQd7wW\na4EcAFyrgSRD00XyZSPOWp5WhqnqKPB/2JrdWaD7fPdP93njF+CyHi6hhEJ9BWz8\nv3Ja9bVUykTawFJWgZ8HURHka6Tew5Q6pG+KPoUcs3M17DrfraPHLGZqvy0ZrSPE\nbv2p7pll5anm97C0y6RRyX+J\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-8rfvl@tron-app-339ef.iam.gserviceaccount.com",
  client_id: "112817565356147743285",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8rfvl%40tron-app-339ef.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

const db = admin.firestore();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Webhook received:', req.body);
    const { token, customer, sale_status_enum, subscription } = req.body;

    // Validate token
    if (token !== process.env.WEBHOOK_TOKEN) {
      console.error('Invalid token received:', token);
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Validate customer email
    if (!customer?.email) {
      console.error('No customer email in payload');
      return res.status(400).json({ error: 'Customer email is required' });
    }

    // Determine subscription status
    const isActive = sale_status_enum === 2 || (subscription?.status === 'active');
    console.log('Subscription status:', { isActive, sale_status_enum, subscriptionStatus: subscription?.status });

    // Save user access data
    await db.collection('user_access').doc(customer.email).set({
      email: customer.email,
      active: isActive,
      updatedAt: new Date().toISOString(),
      paymentStatus: sale_status_enum,
      subscriptionStatus: subscription?.status || null,
      subscriptionCode: subscription?.code || null,
      nextChargeDate: subscription?.next_charge_date || null
    });

    // Save the full webhook data for reference
    await db.collection('webhooks').doc(`${Date.now()}-${customer.email}`).set({
      ...req.body,
      processedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}