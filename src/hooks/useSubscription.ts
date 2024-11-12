import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface SubscriptionData {
  customer: {
    email: string;
  };
  subscription?: {
    status: string;
    next_charge_date: string;
  };
  sale_status_enum: number;
  processedAt: string;
}

export function useSubscription() {
  const [isSubscriptionActive, setIsSubscriptionActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const checkSubscription = async (email: string) => {
      if (!email) {
        setIsSubscriptionActive(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check manual access first
        const manualAccessRef = doc(db, 'manual_access', email);
        const manualAccessDoc = await getDoc(manualAccessRef);

        if (manualAccessDoc.exists()) {
          const manualAccess = manualAccessDoc.data();
          if (manualAccess.active) {
            // If there's an expiration date, check if it's still valid
            if (!manualAccess.expiresAt || new Date(manualAccess.expiresAt) > new Date()) {
              if (isMounted) {
                setIsSubscriptionActive(true);
                setIsLoading(false);
              }
              return;
            }
          }
        }

        // Check user_access collection
        const accessRef = doc(db, 'user_access', email);
        const accessDoc = await getDoc(accessRef);

        if (accessDoc.exists()) {
          const accessData = accessDoc.data();
          if (accessData.active === true) {
            if (isMounted) {
              setIsSubscriptionActive(true);
              setIsLoading(false);
            }
            return;
          }
        }

        // Check webhooks collection for the most recent status
        const webhooksRef = collection(db, 'webhooks');
        const webhookQuery = query(
          webhooksRef,
          where('customer.email', '==', email),
          orderBy('processedAt', 'desc'),
          limit(1)
        );

        const webhookSnapshot = await getDocs(webhookQuery);
        
        if (!webhookSnapshot.empty) {
          const webhookData = webhookSnapshot.docs[0].data() as SubscriptionData;
          
          // Check subscription status
          if (webhookData.subscription) {
            if (webhookData.subscription.status === 'active') {
              const nextChargeDate = new Date(webhookData.subscription.next_charge_date);
              if (nextChargeDate > new Date()) {
                if (isMounted) {
                  setIsSubscriptionActive(true);
                  setIsLoading(false);
                }
                return;
              }
            }
          }
          
          // Check one-time purchase status
          if (webhookData.sale_status_enum === 2) { // 2 = approved
            if (isMounted) {
              setIsSubscriptionActive(true);
              setIsLoading(false);
            }
            return;
          }
        }

        // If none of the above conditions are met, subscription is not active
        if (isMounted) {
          setIsSubscriptionActive(false);
          setIsLoading(false);
        }

      } catch (error) {
        console.error('Error checking subscription:', error);
        if (isMounted) {
          setIsSubscriptionActive(false);
          setIsLoading(false);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        checkSubscription(user.email);
      } else {
        if (isMounted) {
          setIsSubscriptionActive(false);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { isSubscriptionActive, isLoading };
}