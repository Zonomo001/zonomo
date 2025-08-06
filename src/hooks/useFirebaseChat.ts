import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc, 
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirebaseMessage {
  id: string;
  message: string;
  sender: string;
  senderName?: string;
  createdAt: any;
  timestamp: Date;
}

export interface BargainData {
  originalPrice: number;
  userOffer: number;
  providerOffer: number;
  confirmations: string[];
}

export interface FirebaseChatRoom {
  id: string;
  participants: string[];
  productId: string;
  bookingDate: string;
  bookingTime: string;
  chatRoomName: string;
  customerName: string;
  customerEmail: string;
  createdAt: any;
  lastMessage?: FirebaseMessage;
  productName?: string;
  bargain?: BargainData;
}

interface UseFirebaseChatProps {
  currentUserId: string;
}

export function useFirebaseChat({ currentUserId }: UseFirebaseChatProps) {
  const [chatRooms, setChatRooms] = useState<FirebaseChatRoom[]>([]);
  const [messages, setMessages] = useState<FirebaseMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [activeChatRoom, setActiveChatRoom] = useState<FirebaseChatRoom | null>(null); 

  useEffect(() => {
    if (!currentUserId) return;

    async function fetchChatRooms() {
      setLoading(true);
      try {
        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(chatRoomsRef, where('participants', 'array-contains', currentUserId));
        const snapshot = await getDocs(q);

        const rooms: FirebaseChatRoom[] = [];

        for (const docSnapshot of snapshot.docs) {
          const roomData = docSnapshot.data();
          const roomId = docSnapshot.id;

          const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
          const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
          const messagesSnapshot = await getDocs(messagesQuery);

          let lastMessage: FirebaseMessage | undefined;
          if (!messagesSnapshot.empty) {
            const lastDoc = messagesSnapshot.docs[0];
            const lastData = lastDoc.data();
            lastMessage = {
              id: lastDoc.id,
              message: lastData.message,
              sender: lastData.sender,
              senderName: lastData.senderName,
              createdAt: lastData.createdAt,
              timestamp: lastData.createdAt?.toDate() || new Date(),
            };
          }

          rooms.push({
            id: roomId,
            participants: roomData.participants || [],
            productId: roomData.productId || '',
            bookingDate: roomData.bookingDate || '',
            bookingTime: roomData.bookingTime || '',
            chatRoomName: roomData.chatRoomName || `Chat with ${roomData.customerName || 'User'}`,
            customerName: roomData.customerName || '',
            customerEmail: roomData.customerEmail || '',
            createdAt: roomData.createdAt,
            lastMessage,
            productName: roomData.productName || 'Service',
            bargain: roomData.bargain || undefined,
          });
        }

        rooms.sort((a, b) =>
          (b.lastMessage?.timestamp?.getTime() || 0) - (a.lastMessage?.timestamp?.getTime() || 0)
        );

        setChatRooms(rooms);
      } catch (err) {
        console.error('Error loading chat rooms:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchChatRooms();
  }, [currentUserId]);

  useEffect(() => {
    if (!selectedChatRoomId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'chatRooms', selectedChatRoomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList: FirebaseMessage[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        messagesList.push({
          id: doc.id,
          message: data.message,
          sender: data.sender,
          senderName: data.senderName,
          createdAt: data.createdAt,
          timestamp: data.createdAt?.toDate() || new Date(),
        });
      });

      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [selectedChatRoomId]);

  useEffect(() => {
    if (!selectedChatRoomId) {
      setActiveChatRoom(null);
      return;
    }

    const chatRoomRef = doc(db, 'chatRooms', selectedChatRoomId);
    const unsubscribe = onSnapshot(chatRoomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
    
        setActiveChatRoom({
          id: selectedChatRoomId,
          participants: data.participants || [],
          productId: data.productId || '',
          bookingDate: data.bookingDate || '',
          bookingTime: data.bookingTime || '',
          chatRoomName: data.chatRoomName || `Chat with ${data.customerName || 'User'}`,
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          createdAt: data.createdAt,
          productName: data.productName || 'Service',
          bargain: data.bargain || undefined,
          lastMessage: undefined, 
        });

        setChatRooms(prev => prev.map(room => 
          room.id === selectedChatRoomId 
            ? { 
                ...room, 
                bargain: data.bargain, 
                productName: data.productName 
              }
            : room
        ));
      }
    });

    return () => unsubscribe();
  }, [selectedChatRoomId]);

  const sendMessage = useCallback(async (
    chatRoomId: string,
    messageText: string,
    senderName: string
  ) => {
    if (!messageText.trim() || !currentUserId) return;

    try {
      const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
      await addDoc(messagesRef, {
        message: messageText.trim(),
        sender: currentUserId,
        senderName,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [currentUserId]);

  const updateBargainOffer = useCallback(async (
    chatRoomId: string,
    userId: string,
    newOffer: number,
    isUser: boolean
  ) => {
    try {
      const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
   
      const chatRoomSnap = await getDoc(chatRoomRef);
      if (!chatRoomSnap.exists()) {
        console.error('Chat room does not exist');
        return;
      }
      
      const currentData = chatRoomSnap.data();
      const currentBargain = currentData.bargain || {
        originalPrice: 0,
        userOffer: 0,
        providerOffer: 0,
        confirmations: []
      };
      
      const updatedBargain = {
        ...currentBargain,
        [isUser ? 'userOffer' : 'providerOffer']: newOffer,
        confirmations: [] 
      };

      await updateDoc(chatRoomRef, {
        bargain: updatedBargain
      });

  
      const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
      await addDoc(messagesRef, {
        message: ` ${isUser ? 'Customer' : 'Provider'} updated their offer to ₹${newOffer}`,
        sender: 'admin',
        createdAt: serverTimestamp(),
      });

      console.log('Bargain offer updated successfully', { 
        isUser, 
        newOffer, 
        updatedBargain 
      });

    } catch (error) {
      console.error('Error updating bargain offer:', error);
      throw error; 
    }
  }, []);


const confirmBargain = useCallback(async (
  chatRoomId: string,
  userId: string
) => {
  try {
    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
    const chatRoomSnap = await getDoc(chatRoomRef);
    
    if (!chatRoomSnap.exists()) {
      console.error('Chat room does not exist');
      return;
    }
    
    const data = chatRoomSnap.data();
    const currentConfirmations = data.bargain?.confirmations || [];
    
    console.log('Confirming bargain:', { 
      userId, 
      currentConfirmations, 
      bargain: data.bargain,
      participants: data.participants 
    });
    
    if (currentConfirmations.includes(userId)) {
      console.log('User already confirmed, skipping');
      return;
    }

    const newConfirmations = [...currentConfirmations, userId];
    
    await updateDoc(chatRoomRef, {
      'bargain.confirmations': newConfirmations
    });

   
    const isCustomer = data.participants[0] === userId;
    const userType = isCustomer ? 'Customer' : 'Provider';
    const confirmedPrice = isCustomer ? data.bargain?.providerOffer : data.bargain?.userOffer;
    

    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
    await addDoc(messagesRef, {
      message: ` ${userType} confirmed the deal at ₹${confirmedPrice}`,
      sender: 'admin',
      createdAt: serverTimestamp(),
    });
    
    console.log('Confirmation added successfully:', { 
      newConfirmations, 
      userType,
      confirmedPrice,
      totalConfirmations: newConfirmations.length 
    });
    
  
    if (newConfirmations.length === 2) {
      console.log('Both parties confirmed, creating booking...');
   
      const finalPrice = data.bargain?.userOffer === data.bargain?.providerOffer 
        ? data.bargain?.userOffer 
        : Math.max(data.bargain?.userOffer || 0, data.bargain?.providerOffer || 0);
        
      await createBooking(chatRoomId, {...data, bargain: {...data.bargain, finalPrice}});
    }
    
  } catch (error) {
    console.error('Error confirming bargain:', error);
    throw error;
  }
}, []);



  const createBooking = useCallback(async (chatRoomId: string, chatRoomData: any) => {
    try {
      console.log('Creating booking with data:', chatRoomData);
      
      const bookingData = {
        chatRoomId,
        participants: chatRoomData.participants,
        productId: chatRoomData.productId,
        bookingDate: chatRoomData.bookingDate,
        bookingTime: chatRoomData.bookingTime,
        customerName: chatRoomData.customerName,
        customerEmail: chatRoomData.customerEmail,
        finalPrice: chatRoomData.bargain?.userOffer || 0, 
        status: 'confirmed',
        createdAt: serverTimestamp(),
      };
 
      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
      console.log('Booking created with ID:', bookingRef.id);
      
      const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
      await addDoc(messagesRef, {
        message: `🎉 Booking Confirmed!\n\nBooking ID: ${bookingRef.id}\nFinal Price: $${chatRoomData.bargain?.userOffer || 0}\nService: ${chatRoomData.productName || 'Service'}\nDate: ${new Date(chatRoomData.bookingDate).toLocaleDateString()}\nTime: ${chatRoomData.bookingTime}\n\nYour booking has been added to the system and both parties will be notified.`,
        sender: 'admin',
        createdAt: serverTimestamp(),
      });
      
      console.log('Booking confirmation message sent');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      

      try {
        const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
        await addDoc(messagesRef, {
          message: ` Error creating booking. Please contact support or try again later.`,
          sender: 'admin',
          createdAt: serverTimestamp(),
        });
      } catch (msgError) {
        console.error('Error sending error message:', msgError);
      }
    }
  }, []);

  const getOtherParticipant = useCallback((room: FirebaseChatRoom) => {
    const otherId = room.participants.find(id => id !== currentUserId) || '';
    return {
      id: otherId,
      name: room.customerName || 'Other User',
      status: 'online',
    };
  }, [currentUserId]);

  const getChatRoomById = useCallback(async (chatRoomId: string): Promise<FirebaseChatRoom | null> => {
    try {
      const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
      const snap = await getDoc(chatRoomRef);
      if (!snap.exists()) return null;

      const data = snap.data();
      return {
        id: chatRoomId,
        participants: data.participants || [],
        productId: data.productId || '',
        bookingDate: data.bookingDate || '',
        bookingTime: data.bookingTime || '',
        chatRoomName: data.chatRoomName || `Chat with ${data.customerName || 'User'}`,
        customerName: data.customerName || '',
        customerEmail: data.customerEmail || '',
        createdAt: data.createdAt,
        productName: data.productName || 'Service',
        bargain: data.bargain || undefined,
      };
    } catch (err) {
      console.error('Error loading room by ID:', err);
      return null;
    }
  }, []);

  return {
    chatRooms,
    messages,
    loading,
    selectedChatRoomId,
    setSelectedChatRoomId,
    sendMessage,
    getOtherParticipant,
    getChatRoomById,
    updateBargainOffer,
    confirmBargain,
    activeChatRoom, 
  };
}
