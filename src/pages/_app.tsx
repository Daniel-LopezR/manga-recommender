import "tailwindcss/tailwind.css";
import "../styles/global.css";
import type { AppProps, AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Layout from "@/components/Layout";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default trpc.withTRPC(MyApp);
