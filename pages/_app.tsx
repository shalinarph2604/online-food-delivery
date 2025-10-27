import '@/styles/globals.css'
import type { AppProps } from 'next/app'ss
import { SessionProvider } from 'next-auth/react'
import LoginModal from '@/components/modals/LoginModal'
import RegisterModal from '@/components/modals/RegisterModal'
import CartModal from '@/components/modals/CartModal'
import TopUpModal from '@/components/modals/TopUpModal'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <LoginModal />
      <RegisterModal />
      <CartModal />
      <TopUpModal />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}