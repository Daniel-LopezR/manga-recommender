import "tailwindcss/tailwind.css";
import "../styles/global.css";
import Layout from "@/components/Layout";
import type { AppProps, AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};
export default trpc.withTRPC(MyApp);
