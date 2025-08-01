/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    products: Product;
    media: Media;
    product_files: ProductFile;
    orders: Order;
    bookings: Booking;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface User {
  id: string;
  products?: (string | Product)[] | null;
  product_files?: (string | ProductFile)[] | null;
  role: 'admin' | 'provider' | 'user';
  providerDetails?: {
    businessName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    experience?: number | null;
    certifications?:
      | {
          name?: string | null;
          issuer?: string | null;
          year?: number | null;
          id?: string | null;
        }[]
      | null;
    serviceAreas?:
      | {
          area?: string | null;
          radius?: number | null;
          id?: string | null;
        }[]
      | null;
  };
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  _verified?: boolean | null;
  _verificationToken?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
  name?: string | null;
  mobile?: string | null;
  address?: string | null;
  pincode?: string | null;
}
export interface Product {
  id: string;
  user?: (string | null) | User;
  name: string;
  description: string;
  price: number;
  category: 'cleaning' | 'plumbing' | 'electrical' | 'carpentry' | 'painting' | 'gardening';
  serviceLocation: string;
  serviceType: 'one_time' | 'recurring';
  duration: number;
  availability: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    timeSlots: {
      startTime: string;
      endTime: string;
      id?: string | null;
    }[];
    id?: string | null;
  }[];
  product_files?: (string | null) | ProductFile;
  approvedForSale?: ('pending' | 'approved' | 'denied') | null;
  priceId?: string | null;
  stripeId?: string | null;
  images: {
    image: string | Media;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
export interface ProductFile {
  id: string;
  user?: (string | null) | User;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface Media {
  id: string;
  user?: (string | null) | User;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
export interface Order {
  id: string;
  _isPaid: boolean;
  user: string | User;
  products: (string | Product)[];
  updatedAt: string;
  createdAt: string;
}
export interface Booking {
  id: string;
  service: string | Product;
  customer: string | User;
  provider: string | User;
  requestedDate: string;
  requestedTimeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  customerNotes?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}