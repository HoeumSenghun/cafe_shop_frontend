import CredentialsProvider from 'next-auth/providers/credentials'
import { loginSchema } from '@/lib/schemas/auth'
import { getJwtRolesServer } from '@/lib/jwt-server'
import { loginUser, refreshTokens } from '@/services/auth-service'
import { isSecureAuthCookies, revokeBackendTokens } from '@/lib/auth-server'

function normalizeRoles (accessToken) {
  const roles = getJwtRolesServer(accessToken)
  return roles.map((r) => String(r).replace(/^ROLE_/, ''))
}

async function refreshAccessToken (token) {
  if (!token?.refreshToken) {
    return { ...token, error: 'RefreshTokenError' }
  }

  const res = await refreshTokens({ refreshToken: token.refreshToken })
  if (!res.ok || !res.data?.accessToken) {
    return { ...token, error: 'RefreshTokenError' }
  }

  const expiresInSeconds = res.data.expiresInSeconds ?? 3600
  return {
    ...token,
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken ?? token.refreshToken,
    accessTokenExpires: Date.now() + expiresInSeconds * 1000,
    roles: normalizeRoles(res.data.accessToken),
    error: undefined
  }
}

export const authOptions = {
  useSecureCookies: isSecureAuthCookies(),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const res = await loginUser(parsed.data)
        if (!res.ok || !res.data?.accessToken) return null

        const { accessToken, refreshToken, expiresInSeconds } = res.data
        const roles = normalizeRoles(accessToken)

        return {
          id: parsed.data.email,
          email: parsed.data.email,
          accessToken,
          refreshToken,
          expiresInSeconds: expiresInSeconds ?? 3600,
          roles
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + (user.expiresInSeconds || 3600) * 1000,
          roles: user.roles || [],
          email: user.email
        }
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session ({ session, token }) {
      if (token.error === 'RefreshTokenError') {
        session.error = 'RefreshTokenError'
      }

      session.accessToken = token.accessToken
      session.roles = token.roles || []
      session.user = {
        ...session.user,
        email: token.email
      }

      return session
    }
  },
  events: {
    async signOut ({ token }) {
      await revokeBackendTokens(token)
    }
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === 'production'
      ? undefined
      : 'kboyhun-cafe-dev-secret-change-in-production')
}
