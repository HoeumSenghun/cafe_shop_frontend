'use client'

import { create } from 'zustand'

function rolesFromSession (session) {
  return Array.isArray(session?.roles) ? session.roles : []
}

export const useAuthStore = create((set, get) => ({
  status: 'loading',
  email: null,
  roles: [],
  isLoggedIn: false,
  isCustomer: false,
  isCashier: false,
  isAdmin: false,
  isStaff: false,

  setFromSession (session, status = 'authenticated') {
    const roles = rolesFromSession(session)
    const isLoggedIn = status === 'authenticated' && Boolean(session)

    set({
      status,
      email: session?.user?.email || null,
      roles,
      isLoggedIn,
      isCustomer: roles.includes('CUSTOMER'),
      isCashier: roles.includes('CASHIER'),
      isAdmin: roles.includes('ADMIN'),
      isStaff: roles.includes('CASHIER') || roles.includes('ADMIN')
    })
  },

  clear () {
    set({
      status: 'unauthenticated',
      email: null,
      roles: [],
      isLoggedIn: false,
      isCustomer: false,
      isCashier: false,
      isAdmin: false,
      isStaff: false
    })
  },

  hasRole (role) {
    return get().roles.includes(role)
  }
}))
