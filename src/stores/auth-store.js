'use client'

import { create } from 'zustand'
import { getJwtRoles } from '@/lib/jwt'

const ACCESS_TOKEN_KEY = 'cafe.accessToken'
const REFRESH_TOKEN_KEY = 'cafe.refreshToken'

function readSession (key) {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage.getItem(key)
  } catch (err) {
    return null
  }
}

function writeSession (key, value) {
  if (typeof window === 'undefined') return
  try {
    if (!value) {
      window.sessionStorage.removeItem(key)
      return
    }
    window.sessionStorage.setItem(key, value)
  } catch (err) {}
}

function readLocal (key) {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch (err) {
    return null
  }
}

function writeLocal (key, value) {
  if (typeof window === 'undefined') return
  try {
    if (!value) {
      window.localStorage.removeItem(key)
      return
    }
    window.localStorage.setItem(key, value)
  } catch (err) {}
}

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  refreshToken: null,
  expiresAtMs: null,
  roles: [],
  isHydrated: false,

  hydrate () {
    const accessToken = readSession(ACCESS_TOKEN_KEY)
    const refreshToken = readLocal(REFRESH_TOKEN_KEY)

    set({
      accessToken,
      refreshToken,
      roles: accessToken ? getJwtRoles(accessToken) : [],
      isHydrated: true
    })
  },

  setTokens ({ accessToken, refreshToken, expiresInSeconds }) {
    const expiresAtMs =
      typeof expiresInSeconds === 'number'
        ? Date.now() + expiresInSeconds * 1000
        : null

    writeSession(ACCESS_TOKEN_KEY, accessToken || null)
    writeLocal(REFRESH_TOKEN_KEY, refreshToken || null)

    set({
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      expiresAtMs,
      roles: accessToken ? getJwtRoles(accessToken) : []
    })
  },

  clear () {
    writeSession(ACCESS_TOKEN_KEY, null)
    writeLocal(REFRESH_TOKEN_KEY, null)
    set({
      accessToken: null,
      refreshToken: null,
      expiresAtMs: null,
      roles: []
    })
  },

  getAuthHeader () {
    const token = get().accessToken
    if (!token) return null
    return `Bearer ${token}`
  }
}))

