// src/utils/constants.js
export const API_ENDPOINTS = {
  BASE_URL: 'http://192.168.1.100:3000/api', // Change to your backend URL
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  BOOKS: {
    ALL: '/books',
    BY_ID: '/books/:id',
    SELLER_BOOKS: '/books/seller/my-books',
    ADD: '/books',
    UPDATE: '/books/:id',
    DELETE: '/books/:id',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE: '/cart/:bookId',
    REMOVE: '/cart/:bookId',
    CLEAR: '/cart',
  },
  ORDERS: {
    CREATE: '/orders',
    BUYER: '/orders/buyer',
    SELLER: '/orders/seller',
    UPDATE_STATUS: '/orders/:orderId/status',
  },
};

export const ORDER_STATUS = {
  PENDING: 'Pending',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
};

export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
};
