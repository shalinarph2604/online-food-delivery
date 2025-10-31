import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import LoginModal from '@/components/modals/LoginModal'
import RegisterModal from '@/components/modals/RegisterModal'
import CartModal from '@/components/modals/CartModal'
import TopUpModal from '@/components/modals/TopUpModal'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <LoginModal />
        <RegisterModal />
        <CartModal />
        <TopUpModal />
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}