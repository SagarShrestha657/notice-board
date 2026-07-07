import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white',
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            }
          },
          error: {
            style: {
              background: '#ef4444',
            }
          }
        }} 
      />
    </Layout>
  );
}
