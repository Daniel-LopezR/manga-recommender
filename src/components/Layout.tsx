import { useRouter } from "next/router";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Toast, { toastType } from "./Toast/Toast";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  console.log(router.query.callbackUrl);
  const callbackUrl = router.query.callbackUrl as string;
  const toastProps = {
    type: toastType.error,
    message:
      router.query.error === "Callback"
        ? "There was a problem during the process of authentication with MyAnimeList"
        : (router.query.error! as string),
  };

  if (callbackUrl !== undefined) {
    const redirectUrl = (callbackUrl.includes("?")) ? callbackUrl.substring(0, callbackUrl.indexOf("?")) : callbackUrl;

    router.push({
      pathname: redirectUrl,
      query: router.query.error
        ? {
            error: router.query.error,
          }
        : undefined,
    });
  }
  return (
    <div className="h-full flex flex-col">
      <Toast {...toastProps} />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
