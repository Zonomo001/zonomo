"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  DollarSign,
  MessageCircle,
  Clock,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime, getInitials } from "@/lib/utils2";
import type {
  FirebaseChatRoom,
  FirebaseMessage,
} from "@/hooks/useFirebaseChat";
import { useFirebaseChat } from "@/hooks/useFirebaseChat";
import Link from "next/link";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

interface ChatUIProps {
  serverUser: CurrentUser;
}

interface BargainingWidgetProps {
  originalPrice: number;
  userOffer: number;
  providerOffer: number;
  confirmations: string[];
  currentUserId: string;
  isUserRole: boolean;
  onUpdateOffer: (newOffer: number) => void;
  onConfirm: () => void;
  activeChatRoom?: FirebaseChatRoom;
}

interface ExtendedMessage extends FirebaseMessage {
  status?: "sent" | "delivered" | "read";
  isGrouped?: boolean;
  showAvatar?: boolean;
}

export function BargainingWidget({
  originalPrice,
  userOffer,
  providerOffer,
  confirmations,
  currentUserId,
  isUserRole,
  onUpdateOffer,
  onConfirm,
  activeChatRoom,
}: BargainingWidgetProps) {
  const [pendingOffer, setPendingOffer] = useState(
    isUserRole ? userOffer : providerOffer
  );
  const [isLoading, setIsLoading] = useState(false);
  const [increment, setIncrement] = useState(50);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    const currentOffer = isUserRole ? userOffer : providerOffer;
    setPendingOffer(currentOffer);
  }, [userOffer, providerOffer, isUserRole]);

  const hasUserConfirmed = confirmations.includes(currentUserId);
  const bothConfirmed = confirmations.length === 2;
  const otherPartyOffer = isUserRole ? providerOffer : userOffer;
  const myOffer = isUserRole ? userOffer : providerOffer;

  const canConfirm =
    !hasUserConfirmed &&
    !bothConfirmed &&
    ((otherPartyOffer > 0 && myOffer > 0) ||
      (userOffer === providerOffer && userOffer > 0));

  const handlePriceChange = (isIncrement: boolean) => {
    const change = isIncrement ? increment : -increment;
    const newOffer = Math.max(0, pendingOffer + change);
    setPendingOffer(newOffer);
  };

  const handleCustomInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomInput(numericValue);
  };

  const handleApplyCustomInput = () => {
    const numericValue = parseInt(customInput);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setPendingOffer(numericValue);
      setCustomInput("");
      setShowCustomInput(false);
    }
  };

  const quickIncrements = [25, 50, 100, 250, 500];

  const handleUpdateOffer = async () => {
    setIsLoading(true);
    try {
      await onUpdateOffer(pendingOffer);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  const hasOfferChanged = pendingOffer !== myOffer;
  const showWaitingForOther = hasUserConfirmed && !bothConfirmed;
  const finalPrice = bothConfirmed
    ? userOffer === providerOffer
      ? userOffer
      : Math.max(userOffer, providerOffer)
    : 0;

  const calculateSavings = () => {
    const maxOffer = Math.max(userOffer || 0, providerOffer || 0);
    const savings = originalPrice - maxOffer;
    return savings > 0 ? savings : 0;
  };

  const formatRupee = (amount: number | string) => {
    const num = typeof amount === "string" ? parseInt(amount) : amount;
    if (isNaN(num)) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  if (bothConfirmed) {
    return (
      <div className="mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-green-600/10" />

        <Card className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 border-green-500/50 shadow-2xl shadow-green-900/50">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                <div className="relative bg-green-500 rounded-full w-16 h-16 flex items-center justify-center">
                  <Check className="h-8 w-8 text-white animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-100 flex items-center justify-center gap-2">
                  Booking Confirmed!
                </h3>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
                  <p className="text-lg font-bold text-white">
                    Final Price: {formatRupee(finalPrice)}
                  </p>
                  <p className="text-sm text-green-200 mt-1">
                    Service: {activeChatRoom?.chatRoomName || "Service"}
                  </p>
                  <p className="text-xs text-green-300 mt-2">
                    {activeChatRoom &&
                      new Date(activeChatRoom.bookingDate).toLocaleDateString(
                        "en-IN"
                      )}{" "}
                    at {activeChatRoom?.bookingTime}
                  </p>
                </div>

                {calculateSavings() > 0 && (
                  <div className="bg-yellow-500/20 rounded-lg p-2 border border-yellow-400/30">
                    <p className="text-yellow-200 text-sm font-medium">
                      You saved {formatRupee(calculateSavings())} from original
                      price!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl" />

      <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-600/50 shadow-2xl shadow-black/50 backdrop-blur-sm">
        <CardHeader className="pb-4 relative">
          <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <CardTitle className="text-white text-lg flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Price Negotiation
              </span>
              <p className="text-xs text-gray-400 font-normal mt-1">
                Negotiate the best price for your service
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div
              className={cn(
                "relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg",
                isUserRole &&
                  hasUserConfirmed &&
                  "ring-2 ring-blue-400 shadow-blue-400/25"
              )}
            >
              <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 rounded-bl-xl" />
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Customer Offer
              </p>
              <p className="text-2xl font-bold text-blue-400 mb-2">
                {formatRupee(userOffer || 0)}
              </p>
              {userOffer === 0 && (
                <p className="text-xs text-gray-500">Not set</p>
              )}

              {isUserRole && hasUserConfirmed && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                  ✓ You Confirmed
                </Badge>
              )}
              {!isUserRole &&
                confirmations.some((id) => id !== currentUserId) && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                    ✓ Customer Confirmed
                  </Badge>
                )}
            </div>

            <div
              className={cn(
                "relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg",
                !isUserRole &&
                  hasUserConfirmed &&
                  "ring-2 ring-orange-400 shadow-orange-400/25"
              )}
            >
              <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/10 rounded-bl-xl" />
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Provider Offer
              </p>
              <p className="text-2xl font-bold text-orange-400 mb-2">
                {formatRupee(providerOffer || 0)}
              </p>
              {providerOffer === 0 && (
                <p className="text-xs text-gray-500">Not set</p>
              )}

              {!isUserRole && hasUserConfirmed && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                  ✓ You Confirmed
                </Badge>
              )}
              {isUserRole &&
                confirmations.some((id) => id !== currentUserId) && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                    ✓ Provider Confirmed
                  </Badge>
                )}
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-3 border border-gray-600/30">
            <p className="text-sm text-gray-300">
              Original Price:{" "}
              <span className="line-through text-gray-500">
                {formatRupee(originalPrice)}
              </span>
              {calculateSavings() > 0 && (
                <span className="text-green-400 ml-3 font-medium">
                  Save {formatRupee(calculateSavings())}!
                </span>
              )}
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg" />
                <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl px-6 py-4 min-w-[160px] text-center border border-gray-600/50">
                  <p className="text-3xl font-bold text-white mb-1">
                    {formatRupee(pendingOffer)}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Your {isUserRole ? "Offer" : "Counter"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || bothConfirmed}
              >
                <span className="text-lg mr-1"></span>
                Edit
              </Button>
            </div>

            {showCustomInput && (
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                      ₹
                    </span>
                    <Input
                      type="text"
                      placeholder="Enter amount"
                      value={customInput}
                      onChange={(e) => handleCustomInput(e.target.value)}
                      className="pl-8 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 text-center text-lg font-medium focus:border-blue-500 focus:ring-blue-500/20"
                      disabled={isLoading || bothConfirmed}
                    />
                  </div>
                  <Button
                    onClick={handleApplyCustomInput}
                    disabled={!customInput || isLoading || bothConfirmed}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 hover:from-green-700 hover:to-emerald-700 shadow-lg px-6"
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomInput("");
                    }}
                    variant="outline"
                    className="bg-gray-600/50 border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center font-medium">
                Quick adjust by:
              </p>
              <div className="flex justify-center flex-wrap gap-2">
                {quickIncrements.map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    onClick={() => setIncrement(value)}
                    className={cn(
                      "text-sm px-4 py-2 transition-all duration-200",
                      increment === value
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white shadow-lg scale-105"
                        : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
                    )}
                    disabled={isLoading || bothConfirmed}
                  >
                    {formatRupee(value)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handlePriceChange(false)}
                className="bg-gradient-to-r from-red-600 to-red-500 border-0 text-white hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-red-500/25 transition-all duration-200 w-14 h-14"
                disabled={isLoading || bothConfirmed}
              >
                <Minus className="h-6 w-6" />
              </Button>

              <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg px-4 py-2 border border-gray-600/30">
                <p className="text-lg font-bold text-white">
                  ±{formatRupee(increment)}
                </p>
                <p className="text-xs text-gray-400">Adjust by</p>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handlePriceChange(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 border-0 text-white hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-green-500/25 transition-all duration-200 w-14 h-14"
                disabled={isLoading || bothConfirmed}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex justify-center flex-wrap gap-2">
              <Button
                onClick={() => setPendingOffer(originalPrice)}
                variant="outline"
                size="sm"
                className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200"
                disabled={isLoading || bothConfirmed}
              >
                Reset ({formatRupee(originalPrice)})
              </Button>
              {otherPartyOffer > 0 && (
                <Button
                  onClick={() => setPendingOffer(otherPartyOffer)}
                  variant="outline"
                  size="sm"
                  className="bg-orange-700/50 border-orange-600 text-orange-300 hover:bg-orange-600 hover:text-white transition-all duration-200"
                  disabled={isLoading || bothConfirmed}
                >
                  Match {isUserRole ? "Provider" : "Customer"} (
                  {formatRupee(otherPartyOffer)})
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              {hasOfferChanged && !bothConfirmed && (
                <Button
                  onClick={handleUpdateOffer}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    `Update to ${formatRupee(pendingOffer)}`
                  )}
                </Button>
              )}

              <Button
                onClick={handleConfirm}
                disabled={!canConfirm || isLoading}
                className={cn(
                  "flex-1 border-0 transition-all duration-200 shadow-lg",
                  canConfirm
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/25"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : showWaitingForOther ? (
                  ` Waiting for ${isUserRole ? "Provider" : "Customer"}...`
                ) : hasUserConfirmed ? (
                  " Confirmed"
                ) : canConfirm ? (
                  ` Accept ${formatRupee(
                    isUserRole ? providerOffer : userOffer
                  )}`
                ) : (
                  "Set Your Offer First"
                )}
              </Button>
            </div>
          </div>

          {showWaitingForOther && (
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-yellow-100 font-medium flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                You confirmed{" "}
                {formatRupee(isUserRole ? providerOffer : userOffer)}. Waiting
                for {isUserRole ? "Provider" : "Customer"} to accept...
              </p>
            </div>
          )}

          {!showWaitingForOther &&
            !bothConfirmed &&
            userOffer === providerOffer &&
            userOffer > 0 && (
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="text-green-100 font-medium flex items-center justify-center gap-2">
                  Both agreed on {formatRupee(userOffer)}! Click confirm to
                  finalize the booking.
                </p>
              </div>
            )}

          {!showWaitingForOther &&
            !bothConfirmed &&
            userOffer !== providerOffer &&
            userOffer > 0 &&
            providerOffer > 0 && (
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="text-blue-100 text-sm">
                  <strong>Customer:</strong> {formatRupee(userOffer)} |{" "}
                  <strong>Provider:</strong> {formatRupee(providerOffer)}
                  <br />
                  {canConfirm && (
                    <span className="text-blue-200">
                      You can accept the {isUserRole ? "provider" : "customer"}
                      's offer or make a counter-offer
                    </span>
                  )}
                </p>
              </div>
            )}

          {(userOffer === 0 || providerOffer === 0) && !bothConfirmed && (
            <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 border border-gray-500/30 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-gray-300 flex items-center justify-center gap-2">
                {userOffer === 0 && providerOffer === 0
                  ? "Start negotiating by setting your offer"
                  : userOffer === 0
                  ? "Waiting for customer to make an offer"
                  : "Waiting for provider to make an offer"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const MessageBubble = ({
  message,
  isOwn,
  senderName,
  showAvatar = true,
  isGrouped = false,
}: {
  message: ExtendedMessage;
  isOwn: boolean;
  senderName: string;
  showAvatar?: boolean;
  isGrouped?: boolean;
}) => {
  const isSystemMessage = message.sender === "admin";

  if (isSystemMessage) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-800 rounded-lg px-4 py-2 max-w-md">
          <p className="text-xs text-gray-400 font-medium mb-1">
            System Message
          </p>
          <p className="text-sm text-gray-200 whitespace-pre-line">
            {message.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isOwn ? "justify-end" : "justify-start",
        isGrouped ? "mt-1" : "mt-4"
      )}
    >
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      {!isOwn && !showAvatar && <div className="w-8" />}

      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative",
          isOwn
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-800 text-gray-100 rounded-bl-md"
        )}
      >
        {!isGrouped && !isOwn && (
          <p className="text-xs text-gray-400 mb-1">{senderName}</p>
        )}

        <p className="text-sm leading-relaxed">{message.message}</p>

        <div className="flex items-center justify-end gap-1 mt-1">
          <p
            className={cn("text-xs", isOwn ? "text-blue-100" : "text-gray-400")}
          >
            {formatTime(message.timestamp)}
          </p>

          {isOwn && message.status && (
            <div className="flex items-center">
              {message.status === "sent" && (
                <Clock className="h-3 w-3 text-blue-200" />
              )}
              {message.status === "delivered" && (
                <Check className="h-3 w-3 text-blue-200" />
              )}
              {message.status === "read" && (
                <CheckCheck className="h-3 w-3 text-blue-200" />
              )}
            </div>
          )}
        </div>
      </div>

      {isOwn && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      {isOwn && !showAvatar && <div className="w-8" />}
    </div>
  );
};

function ChatUI({ serverUser }: ChatUIProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useFirebaseChat({
    currentUserId: currentUser?.id || "",
  });

  const groupedMessages = messages.reduce(
    (groups: ExtendedMessage[], message, index) => {
      const prevMessage = messages[index - 1];
      const nextMessage = messages[index + 1];

      const isSameSender = prevMessage && prevMessage.sender === message.sender;
      const isNextSameSender =
        nextMessage && nextMessage.sender === message.sender;

      const timeDiff =
        prevMessage &&
        typeof prevMessage.timestamp === "number" &&
        typeof message.timestamp === "number"
          ? message.timestamp - prevMessage.timestamp
          : Infinity;

      const nextTimeDiff =
        nextMessage &&
        typeof nextMessage.timestamp === "number" &&
        typeof message.timestamp === "number"
          ? nextMessage.timestamp - message.timestamp
          : Infinity;

      const isGrouped = isSameSender && timeDiff < 300000;
      const showAvatar = !isNextSameSender || nextTimeDiff > 300000;

      groups.push({
        ...message,
        isGrouped,
        showAvatar,
        status: "delivered",
      });

      return groups;
    },
    []
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (serverUser) {
      setCurrentUser(serverUser);
      localStorage.setItem("currentUser", JSON.stringify(serverUser));
    }
  }, [serverUser]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (activeChatRoom && !isMobileView) {
      messageInputRef.current?.focus();
    }
  }, [activeChatRoom, isMobileView]);

  const handleUpdateOffer = async (newOffer: number) => {
    if (!activeChatRoom || !currentUser) return;
    const isUserRole = activeChatRoom.participants[0] === currentUser.id;
    await updateBargainOffer(
      activeChatRoom.id,
      currentUser.id,
      newOffer,
      isUserRole
    );
  };

  const handleConfirmBargain = async () => {
    if (!activeChatRoom || !currentUser) return;
    await confirmBargain(activeChatRoom.id, currentUser.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatRoom || !currentUser) return;

    try {
      await sendMessage(activeChatRoom.id, newMessage.trim(), currentUser.name);
      setNewMessage("");
      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const filteredChats = chatRooms.filter((chat) => {
    if (!searchQuery) return true;
    const otherParticipant = getOtherParticipant(chat);
    return (
      otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.chatRoomName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getUnreadCount = (chat: FirebaseChatRoom) => {
    return 0;
  };

  return (
    <div
      className={cn(
        "flex bg-black h-screen",
        isMobileView ? "flex-col md:flex-row" : ""
      )}
    >
      <div
        className={cn(
          "bg-gray-900 border-r border-gray-700 flex flex-col w-80",
          isMobileView && activeChatRoom ? "hidden md:flex" : "flex",
          isMobileView && !activeChatRoom ? "w-full md:w-80" : ""
        )}
      >
        <div
          className={cn(
            "p-4 border-b border-gray-700",
            isMobileView ? "pt-safe-top" : ""
          )}
        >
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Messages</h1>
            <Badge variant="secondary" className="bg-blue-600">
              {filteredChats.length}
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center p-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-700 rounded-full" />
                    <div className="ml-3 flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-white mb-2">No chats yet</h3>
                <p className="text-sm text-gray-400">
                  Your conversations will appear here
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const otherParticipant = getOtherParticipant(chat);
                const unreadCount = getUnreadCount(chat);

                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatRoomId(chat.id)}
                    className={cn(
                      "flex items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-800 active:bg-gray-700",
                      activeChatRoom?.id === chat.id
                        ? "bg-gray-800 border border-gray-600"
                        : ""
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(otherParticipant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900",
                          getStatusColor(otherParticipant.status)
                        )}
                      />
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">
                          {otherParticipant.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <Badge className="bg-blue-600 text-white text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {chat.lastMessage &&
                              formatTime(chat.lastMessage.timestamp)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-blue-400 font-medium mt-0.5 truncate">
                        {chat.chatRoomName}
                      </p>

                      <p className="text-sm text-gray-300 truncate mt-0.5">
                        {chat.lastMessage ? (
                          <>
                            {chat.lastMessage.sender === currentUser?.id
                              ? "You: "
                              : chat.lastMessage.sender === "admin"
                              ? "System: "
                              : ""}
                            {chat.lastMessage.message}
                          </>
                        ) : (
                          "No messages yet"
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      <div
        className={cn(
          "flex flex-col bg-black flex-1",
          isMobileView && !activeChatRoom ? "hidden md:flex" : "flex"
        )}
      >
        {activeChatRoom ? (
          <>
            <div
              className={cn(
                "flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900",
                isMobileView ? "pt-safe-top" : ""
              )}
            >
              <div className="flex items-center">
                {isMobileView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedChatRoomId(null)}
                    className="mr-2 md:hidden text-white hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitials(getOtherParticipant(activeChatRoom).name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900",
                      getStatusColor(getOtherParticipant(activeChatRoom).status)
                    )}
                  />
                </div>

                <div className="ml-3">
                  {/* <h2 className="text-lg font-semibold text-white">
                    Chat with {getOtherParticipant(activeChatRoom).name}
                  </h2> */}
                  <h2 className="text-sm text-blue-400 font-medium">
                    {activeChatRoom.chatRoomName}
                  </h2>
                  <p className="text-xs text-gray-400">
                    📅{" "}
                    {new Date(activeChatRoom.bookingDate).toLocaleDateString(
                      "en-IN"
                    )}{" "}
                    at {activeChatRoom.bookingTime}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4 bg-black">
              <div className="space-y-1">
                {activeChatRoom.bargain && (
                  <BargainingWidget
                    originalPrice={activeChatRoom.bargain.originalPrice}
                    userOffer={activeChatRoom.bargain.userOffer}
                    providerOffer={activeChatRoom.bargain.providerOffer}
                    confirmations={activeChatRoom.bargain.confirmations || []}
                    currentUserId={currentUser?.id || ""}
                    isUserRole={
                      activeChatRoom.participants[0] === currentUser?.id
                    }
                    onUpdateOffer={handleUpdateOffer}
                    onConfirm={handleConfirmBargain}
                    activeChatRoom={activeChatRoom}
                  />
                )}

                {groupedMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-white mb-2">
                      Start the conversation
                    </h3>
                    <p className="text-sm text-gray-400">
                      Send a message to begin chatting
                    </p>
                  </div>
                ) : (
                  groupedMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.sender === currentUser?.id}
                      senderName={
                        message.sender === currentUser?.id
                          ? "You"
                          : message.senderName || "Other User"
                      }
                      showAvatar={message.showAvatar}
                      isGrouped={message.isGrouped}
                    />
                  ))
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div
              className={cn(
                "border-t border-gray-700 p-4 bg-gray-900",
                isMobileView ? "pb-safe-bottom" : ""
              )}
            >
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    ref={messageInputRef}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="resize-none border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-800 text-white placeholder:text-gray-400"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || loading}
                  className={cn(
                    "transition-all",
                    newMessage.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-700 text-gray-400"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-400">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatUI;
