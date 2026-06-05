'use client'

/** Auth is server-only (getServerSession). No SessionProvider — avoids extra NextAuth cookies on logout. */
export default function AppProviders ({ children }) {
  return children
}
