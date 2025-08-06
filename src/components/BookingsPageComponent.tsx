"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Phone, 
  Loader2, 
  User, 
  CreditCard, 
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  TrendingDown
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useFirebaseBookings } from "@/hooks/useFirebaseBookings";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

interface BookingsPageComponentProps {
  currentUser: CurrentUser;
}

export default function BookingsPageComponent({ currentUser }: BookingsPageComponentProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isMounted, setIsMounted] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const { 
    bookings, 
    loading, 
    error, 
    updateBookingStatus, 
    isCustomer,
    getOtherPartyName,
    getUserRole,
    formatPrice,
    getStatusColor,
    getBookingsByStatus
  } = useFirebaseBookings({
    currentUserId: currentUser?.id || ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatDate = (dateString: string) => {
    if (!isMounted) {
      return dateString;
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Time not set';
    
    
    if (timeString.includes(' - ')) {
      return timeString; 
    }
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const upcomingBookings = getBookingsByStatus('confirmed');
  const completedBookings = getBookingsByStatus('completed');
  const cancelledBookings = getBookingsByStatus('cancelled');

  const handleStatusUpdate = async (bookingId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      console.log(`Booking ${bookingId} updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking. Please try again.');
    }
  };

  const toggleBookingDetails = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
      }`}>
        <div className="px-4 pt-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Loading your bookings...</h3>
                <p className="text-sm text-gray-500">Please wait while we fetch your booking data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
      }`}>
        <div className="px-4 pt-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
              <p className="text-red-500 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
    }`}>
      <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-20">
        <div className="max-w-4xl mx-auto">

          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}>
                  Your Bookings
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  Welcome back, {currentUser.name}
                </p>
              </div>
              <div className={`px-4 py-3 rounded-xl ${
                isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
              }`}>
                <p className="text-sm font-medium">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{bookings.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className={`p-4 rounded-xl ${
                isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
              }`}>
                <div className="flex items-center">
                  <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Upcoming</p>
                    <p className="text-lg sm:text-xl font-bold">{upcomingBookings.length}</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${
                isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
              }`}>
                <div className="flex items-center">
                  <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-lg sm:text-xl font-bold">{completedBookings.length}</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${
                isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
              }`}>
                <div className="flex items-center">
                  <XCircle className="w-6 sm:w-8 h-6 sm:h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-lg sm:text-xl font-bold">{cancelledBookings.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex rounded-2xl p-1 mb-6 ${
            isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
          }`}>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "upcoming"
                  ? "bg-purple-600 text-white shadow-lg"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">Upcoming ({upcomingBookings.length})</span>
              <span className="sm:hidden">Upcoming</span>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "completed"
                  ? "bg-purple-600 text-white shadow-lg"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">Completed ({completedBookings.length})</span>
              <span className="sm:hidden">Completed</span>
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "cancelled"
                  ? "bg-purple-600 text-white shadow-lg"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <span className="hidden sm:inline">Cancelled ({cancelledBookings.length})</span>
              <span className="sm:hidden">Cancelled</span>
            </button>
          </div>

         
          <div className="space-y-4">
            {(activeTab === "upcoming" 
              ? upcomingBookings 
              : activeTab === "completed" 
                ? completedBookings 
                : cancelledBookings
            ).map((booking) => (
              <div
                key={booking.id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  isDarkMode 
                    ? "bg-gray-900 border border-gray-800 hover:bg-gray-850" 
                    : "bg-white border border-gray-200 hover:shadow-lg"
                }`}
              >
              
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}>
                          {booking.productName} 
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border self-start ${
                          getStatusColor(booking.status)
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <p className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {getOtherPartyName(booking)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs self-start sm:self-auto ${
                          isCustomer(booking)
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          You are: {getUserRole(booking)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <span className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {formatDate(booking.bookingDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-500 mr-2" />
                          <span className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {formatTime(booking.bookingTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="mb-2">
                        <span className={`text-xl sm:text-2xl font-bold ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}>
                          {formatPrice(booking.finalPrice)}
                        </span>
                        {booking.savings > 0 && (
                          <div className="flex items-center sm:justify-end mt-1">
                            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-500 font-medium">
                              Saved {formatPrice(booking.savings)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => toggleBookingDetails(booking.id)}
                        className={`flex items-center gap-1 text-sm ${
                          isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
                        } transition-colors`}
                      >
                        <Eye className="w-4 h-4" />
                        {expandedBooking === booking.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile Responsive */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-800 gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      }`}>
                        ID: {booking.id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {booking.status === "confirmed" && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Mark Complete</span>
                            <span className="sm:hidden">Complete</span>
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      
                    </div>
                  </div>
                </div>

              
                {expandedBooking === booking.id && (
                  <div className={`px-4 sm:px-6 pb-4 sm:pb-6 border-t ${
                    isDarkMode ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-gray-50"
                  }`}>
                    <div className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      <div>
                        <h4 className={`font-medium mb-3 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}>
                          Booking Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                            <span className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}>
                              {booking.address || 'Address not provided'}
                            </span>
                          </div>
                          {booking.category && (
                            <div className="flex items-center">
                              <span className="w-4 h-4 text-gray-500 mr-2">🏷️</span>
                              <span className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}>
                                {booking.category}
                              </span>
                            </div>
                          )}
                          {booking.notes && (
                            <div className="mt-3">
                              <p className={`text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}>
                                Notes:
                              </p>
                              <p className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}>
                                {booking.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    
                      <div>
                        <h4 className={`font-medium mb-3 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}>
                          Contact Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className={`text-sm font-medium ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}>
                              {isCustomer(booking) ? 'Service Provider' : 'Customer'}
                            </p>
                            <p className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                              {getOtherPartyName(booking)}
                            </p>
                            <p className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                              {isCustomer(booking) ? booking.providerEmail : booking.customerEmail}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-500">Original Price:</span>
                              <span className="text-sm line-through text-gray-500">
                                {formatPrice(booking.originalPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-500">Final Price:</span>
                              <span className="text-sm font-medium">
                                {formatPrice(booking.finalPrice)}
                              </span>
                            </div>
                            {booking.savings > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">You Saved:</span>
                                <span className="text-sm font-medium text-green-600">
                                  {formatPrice(booking.savings)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

  
          {(activeTab === "upcoming" ? upcomingBookings : 
            activeTab === "completed" ? completedBookings : cancelledBookings).length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ${
                isDarkMode ? "bg-gray-900" : "bg-gray-200"
              }`}>
                <Calendar className={`w-8 sm:w-10 h-8 sm:h-10 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-medium mb-3 ${
                isDarkMode ? "text-white" : "text-black"
              }`}>
                No {activeTab} bookings
              </h3>
              <p className={`text-sm mb-6 sm:mb-8 max-w-md mx-auto px-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                {activeTab === "upcoming"
                  ? "You don't have any upcoming bookings. Book a service to get started!"
                  : activeTab === "completed"
                  ? "You haven't completed any bookings yet. Complete your first booking to see it here."
                  : "You don't have any cancelled bookings."
                }
              </p>
              {activeTab === "upcoming" && (
                <button className="bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-3 rounded-xl text-white font-medium transition-colors">
                  Book a Service
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
