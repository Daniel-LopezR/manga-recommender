import React from "react";
import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode,
};

export default function Layout({children}: LayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Header/>
      {children}
      <Footer/>
    </div>
  );
}
