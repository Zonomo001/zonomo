import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirebaseBooking {
  id: string;
  chatRoomId: string;
  participants: string[];
  productId: string;
  productName: string;
  chatRoomName?: string; 
  bookingDate: string;
  bookingTime: string;
  customerName: string;
  customerEmail: string;
  providerName: string;
  providerEmail: string;
  finalPrice: number;
  originalPrice: number;
  savings: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  
  address?: string;
  rating?: number;
  category?: string;
  customerPhone?: string;
  providerPhone?: string;
  notes?: string;
}

interface UseFirebaseBookingsProps {
  currentUserId: string;
}

export function useFirebaseBookings({ currentUserId }: UseFirebaseBookingsProps) {
  const [bookings, setBookings] = useState<FirebaseBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProductNameFromChatRoom = useCallback(async (chatRoomId: string): Promise<string> => {
    try {
      const chatRoomDoc = await getDoc(doc(db, 'chatRooms', chatRoomId));
      if (chatRoomDoc.exists()) {
        const chatRoomData = chatRoomDoc.data();
        return chatRoomData.productName || 'Service';
      }
    } catch (error) {
      console.warn('Could not fetch productName from chat room:', error);
    }
    return 'Service';
  }, []);


  const extractBookingFromChatRoom = useCallback(async (chatRoomData: any, chatDocId: string): Promise<FirebaseBooking | null> => {
    try {
      const bargain = chatRoomData.bargain;
      const finalPrice = bargain ? Math.max(bargain.userOffer || 0, bargain.providerOffer || 0) : 0;
      const originalPrice = bargain?.originalPrice || 0;
      const savings = originalPrice > finalPrice ? originalPrice - finalPrice : 0;

  
      const [customerId, providerId] = chatRoomData.participants || [];
      
     
      let customerName = 'Customer';
      let customerEmail = '';
      let providerName = 'Service Provider';
      let providerEmail = '';

      try {
        if (customerId) {
          const customerDoc = await getDoc(doc(db, 'users', customerId));
          if (customerDoc.exists()) {
            const customerData = customerDoc.data();
            customerName = customerData.name || customerData.displayName || 'Customer';
            customerEmail = customerData.email || '';
          }
        }

        if (providerId) {
          const providerDoc = await getDoc(doc(db, 'users', providerId));
          if (providerDoc.exists()) {
            const providerData = providerDoc.data();
            providerName = providerData.name || providerData.displayName || 'Service Provider';
            providerEmail = providerData.email || '';
          }
        }
      } catch (userError) {
        console.warn('Error fetching user details:', userError);
      }

      const booking: FirebaseBooking = {
        id: `chat_${chatDocId}`,
        chatRoomId: chatDocId,
        participants: chatRoomData.participants || [],
        productId: chatRoomData.productId || '',
        productName: chatRoomData.productName || 'Service',
        chatRoomName: chatRoomData.chatRoomName || chatRoomData.productName || 'Service',
        bookingDate: chatRoomData.bookingDate || '',
        bookingTime: chatRoomData.bookingTime || '',
        customerName,
        customerEmail,
        providerName,
        providerEmail,
        finalPrice,
        originalPrice,
        savings,
        status: 'confirmed' as const,
        createdAt: chatRoomData.updatedAt || chatRoomData.createdAt || Timestamp.now(),
      
        address: chatRoomData.address || '',
        category: chatRoomData.category || 'Service',
        customerPhone: chatRoomData.customerPhone || '',
        providerPhone: chatRoomData.providerPhone || '',
        notes: chatRoomData.notes || '',
      };

      return booking;
    } catch (error) {
      console.error('Error extracting booking data from chat room:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }


    const bookingsRef = collection(db, 'bookings');
    const bookingsQuery = query(
      bookingsRef,
      where('participants', 'array-contains', currentUserId),
      orderBy('createdAt', 'desc')
    );

    const chatRoomsRef = collection(db, 'chatRooms');
    const chatRoomsQuery = query(
      chatRoomsRef,
      where('participants', 'array-contains', currentUserId),
      where('bargain.confirmations', '!=', null)
    );

    const unsubscribeBookings = onSnapshot(bookingsQuery, 
      async (bookingsSnapshot) => {
        const directBookings: FirebaseBooking[] = [];

        const bookingPromises = bookingsSnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();

          let productName = data.productName || 'Service';
          if (!data.productName && data.chatRoomId) {
            console.log(' Missing productName, fetching from chat room:', data.chatRoomId);
            productName = await getProductNameFromChatRoom(data.chatRoomId);
            console.log(' Retrieved productName:', productName);
          }
          
          const booking: FirebaseBooking = {
            id: docSnapshot.id,
            chatRoomId: data.chatRoomId || '',
            participants: data.participants || [],
            productId: data.productId || '',
            productName: productName, 
            chatRoomName: data.chatRoomName || productName, 
            bookingDate: data.bookingDate || '',
            bookingTime: data.bookingTime || '',
            customerName: data.customerName || '',
            customerEmail: data.customerEmail || '',
            providerName: data.providerName || 'Service Provider',
            providerEmail: data.providerEmail || '',
            finalPrice: data.finalPrice || 0,
            originalPrice: data.originalPrice || 0,
            savings: data.savings || 0,
            status: data.status || 'confirmed',
            createdAt: data.createdAt,
         
            address: data.address || '',
            rating: data.rating || 0,
            category: data.category || 'Service',
            customerPhone: data.customerPhone || '',
            providerPhone: data.providerPhone || '',
            notes: data.notes || '',
          };
          
          return booking;
        });
        const resolvedBookings = await Promise.all(bookingPromises);
        directBookings.push(...resolvedBookings);

  
        const unsubscribeChatRooms = onSnapshot(chatRoomsQuery,
          async (chatRoomsSnapshot) => {
            const chatRoomBookings: FirebaseBooking[] = [];

            for (const chatDoc of chatRoomsSnapshot.docs) {
              const chatData = chatDoc.data();
              const bargain = chatData.bargain;

              console.log(' Checking chat room for booking:', {
                id: chatDoc.id,
                productName: chatData.productName,
                chatRoomName: chatData.chatRoomName,
                hasBargain: !!bargain,
                confirmations: bargain?.confirmations?.length || 0
              });

           
              if (bargain && bargain.confirmations && bargain.confirmations.length === 2) {
       
                const existingBooking = directBookings.find(b => b.chatRoomId === chatDoc.id);
                
                if (!existingBooking) {
                
                  const bookingData = await extractBookingFromChatRoom(chatData, chatDoc.id);

                  if (bookingData) {
                    console.log(' Added booking from chat room:', {
                      id: bookingData.id,
                      productName: bookingData.productName,
                      chatRoomName: bookingData.chatRoomName
                    });
                    chatRoomBookings.push(bookingData);
                  }
                }
              }
            }

            const allBookings = [...directBookings, ...chatRoomBookings];
            
     
            allBookings.sort((a, b) => {
              const aTime = a.createdAt?.toMillis() || 0;
              const bTime = b.createdAt?.toMillis() || 0;
              return bTime - aTime;
            });

            console.log('📋 Final bookings array:', allBookings.map(b => ({
              id: b.id,
              productName: b.productName,
              status: b.status
            })));

            setBookings(allBookings);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error fetching chat room bookings:', err);
            
            setBookings(directBookings);
            setLoading(false);
          }
        );

        return unsubscribeChatRooms;
      },
      (err) => {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
        setLoading(false);
      }
    );

    return () => {
      unsubscribeBookings();
    };
  }, [currentUserId, extractBookingFromChatRoom, getProductNameFromChatRoom]);

  const updateBookingStatus = useCallback(async (
    bookingId: string, 
    newStatus: 'confirmed' | 'completed' | 'cancelled'
  ) => {
    try {
      if (bookingId.startsWith('chat_')) {
        const chatRoomId = bookingId.replace('chat_', '');
      
        const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
        await updateDoc(chatRoomRef, {
          bookingStatus: newStatus,
          updatedAt: new Date()
        });
      } else {
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, {
          status: newStatus,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }, []);

  const isCustomer = useCallback((booking: FirebaseBooking) => {
    return booking.participants[0] === currentUserId;
  }, [currentUserId]);

  const getOtherPartyName = useCallback((booking: FirebaseBooking) => {
    const isUserCustomer = isCustomer(booking);
    return isUserCustomer ? booking.providerName : booking.customerName;
  }, [isCustomer]);

  const getUserRole = useCallback((booking: FirebaseBooking) => {
    return isCustomer(booking) ? 'customer' : 'provider';
  }, [isCustomer]);

  const formatPrice = useCallback((price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const getBookingsByStatus = useCallback((status: 'confirmed' | 'completed' | 'cancelled') => {
    return bookings.filter(booking => booking.status === status);
  }, [bookings]);

  return {
    bookings,
    loading,
    error,
    updateBookingStatus,
    isCustomer,
    getOtherPartyName,
    getUserRole,
    formatPrice,
    getStatusColor,
    getBookingsByStatus,
  };
}
