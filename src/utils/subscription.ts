import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit, DocumentData } from 'firebase/firestore';

interface SubscriptionData extends DocumentData {
  customer: {
    email: string;
  };
  subscription?: {
    status: string;
    next_charge_date: string;
  };
  sale_status_enum: number;
  sale_status_enum_key: string;
}

export const checkSubscriptionStatus = async (email: string): Promise<boolean> => {
  if (!email) return false;

  try {
    const webhooksRef = collection(db, 'webhooks');
    
    // Query for any active subscription or approved one-time purchase
    const subscriptionQuery = query(
      webhooksRef,
      where('customer.email', '==', email),
      where('sale_status_enum', '==', 2), // 2 = approved
      orderBy('date_created', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(subscriptionQuery);
    
    if (querySnapshot.empty) {
      console.log('No subscription found for:', email);
      return false;
    }

    const data = querySnapshot.docs[0].data() as SubscriptionData;

    // Check for subscription status
    if (data.subscription) {
      if (data.subscription.status === 'active') {
        const nextChargeDate = new Date(data.subscription.next_charge_date);
        const now = new Date();
        return nextChargeDate > now;
      }
      return false;
    }

    // If no subscription data but payment is approved, grant access
    return data.sale_status_enum === 2 && data.sale_status_enum_key === 'approved';

  } catch (error) {
    console.error('Error checking subscription:', error);
    throw error;
  }
};