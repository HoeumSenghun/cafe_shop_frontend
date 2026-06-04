import LoginForm from './login-form'

export default async function LoginPage ({ searchParams }) {
  const params = await searchParams
  const signedOut = params?.signedOut === '1'

  return <LoginForm signedOut={signedOut} />
}
