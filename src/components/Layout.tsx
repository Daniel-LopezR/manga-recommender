import { useRouter } from "next/router";
import React, { useContext } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Toast, { toastType } from "./Toast/Toast";
import {
  StatusToastContext,
  StatusToastContextType,
} from "@/context/statusToastContext";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { addStatusToast } = useContext(
    StatusToastContext
  ) as StatusToastContextType;
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl as string;

  if (callbackUrl !== undefined) {
    const redirectUrl = callbackUrl.includes("?")
      ? callbackUrl.substring(0, callbackUrl.indexOf("?"))
      : callbackUrl;
    router.push({
      pathname: redirectUrl,
    });
    addStatusToast(
      toastType.error,
      "login",
      router.query.error === "Callback"
        ? "There was a problem during the process of authentication with MyAnimeList"
        : (router.query.error! as string)
    );
  }
  return (
    <div className="h-full flex flex-col">
      <Toast />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
