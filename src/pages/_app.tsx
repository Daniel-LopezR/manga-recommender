import "tailwindcss/tailwind.css";
import "../styles/global.css";
import Layout from "@/components/Layout";
import type { AppProps, AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { SessionProvider } from "next-auth/react";
import StatusToastProvider from "@/context/statusToastContext";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <StatusToastProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StatusToastProvider>
    </SessionProvider>
  );
};
export default trpc.withTRPC(MyApp);
