import React, { createContext, useState } from "react";
import { toastType } from "@/components/Toast/Toast";

type StatusToastType = {
  id: number;
  origin: string;
  type: toastType;
  message: string;
};

export type StatusToastContextType = {
  statusToasts: StatusToastType[] | undefined;
  addStatusToast: (type: toastType, origin: string, message: string) => void;
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
  const addStatusToast = (type: toastType, origin: string, message: string) => {
    const newStatusToast: StatusToastType = {
      id:
        statusToasts.length !== 0
          ? statusToasts[statusToasts.length - 1].id + 1
          : 1,
      type: type,
      origin: origin,
      message: message,
    };
    if (statusToasts.filter((st) => st.id === newStatusToast.id).length === 0) {
      statusToasts.push(newStatusToast);
      (origin === "login") ? setStatusToasts(statusToasts) : setStatusToasts(Array(...statusToasts));
    }
  };
  const removeStatusToast = (id: number) => {
    statusToasts.splice(
      statusToasts.findIndex((toast) => {
        return toast.id === id;
      }),
      1
    );
    (origin === "login") ? setStatusToasts(statusToasts) : setStatusToasts(Array(...statusToasts));
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
