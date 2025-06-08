import { FC, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import type { AppProps } from 'next/app';
import axios from 'axios';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from '../components/App';
import { store } from '../store';
import AuthPopup from '../components/Auth';
import currentTheme, { Theme } from '../theme';
import { Config } from '../utils';

axios.defaults.baseURL = Config.API_URL;
axios.defaults.withCredentials = true;

const NextApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [theme, setTheme] = useState<Theme>(null);
  const queryClientRef = useRef(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  useEffect(() => {
    const nProgressStart = () => NProgress.start();
    const nProgressDone = () => NProgress.done();

    // N Progress.
    Router.events.on('routeChangeStart', nProgressStart);
    Router.events.on('routeChangeComplete', nProgressDone);
    Router.events.on('routeChangeError', nProgressDone);

    return () => {
      // N Progress.
      Router.events.on('routeChangeStart', nProgressStart);
      Router.events.on('routeChangeComplete', nProgressDone);
      Router.events.on('routeChangeError', nProgressDone);
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClientRef.current}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <ReduxProvider store={store}>
            <ThemeProvider theme={theme || currentTheme}>
              <App setTheme={setTheme}>
                <Component {...pageProps} />
              </App>
              <AuthPopup />
            </ThemeProvider>
          </ReduxProvider>
        </HydrationBoundary>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default NextApp;
