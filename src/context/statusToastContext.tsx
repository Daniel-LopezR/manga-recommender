import React, { createContext, useState } from "react";
import { toastType } from "@/components/Toast/Toast";

type StatusToastType = {
  id: number;
  type: toastType;
  message: string;
};

export type StatusToastContextType = {
  statusToasts: StatusToastType[] | undefined;
  addStatusToast: (type: toastType, message: string) => void;
  removeStatusToast: (id: number) => void;
};

type ContextProps = {
  children: React.ReactNode;
};

export const StatusToastContext = createContext<
  StatusToastContextType | undefined
>(undefined);

const StatusToastProvider = ({ children }: ContextProps) => {
  const [statusToasts, setStatusToasts] = useState<StatusToastType[]>([]);
  const addStatusToast = (type: toastType, message: string) => {
    const newStatusToast: StatusToastType = {
      id:
        statusToasts.length !== 0
          ? statusToasts[statusToasts.length - 1].id++
          : 1,
      type: type,
      message: message,
    };
    if (statusToasts.filter((st) => st.id === newStatusToast.id).length === 0) {
      console.log(newStatusToast.id, " added");
      statusToasts.push(newStatusToast);
      setStatusToasts(statusToasts);
      console.log(statusToasts);
      
    }
  };
  const removeStatusToast = (id: number) => {
    console.log(statusToasts);
    statusToasts.splice(
      statusToasts.findIndex((toast) => {
        return toast.id === id;
      }),
      1
    );
    console.log(statusToasts);
    setStatusToasts(statusToasts);
  };
  return (
    <StatusToastContext.Provider
      value={{ statusToasts, addStatusToast, removeStatusToast }}
    >
      {children}
    </StatusToastContext.Provider>
  );
};

export default StatusToastProvider;
