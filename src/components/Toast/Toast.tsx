import { useRouter } from "next/router";
import React, { MouseEventHandler, useContext } from "react";
import styles from "./Toast.module.css";
import {
  StatusToastContext,
  StatusToastContextType,
} from "@/context/statusToastContext";

export enum toastType {
  error = "Error",
  success = "Action completed",
}

function Toast() {
  const { statusToasts, removeStatusToast } = useContext(
    StatusToastContext
  ) as StatusToastContextType;
  const deleteToast: MouseEventHandler<HTMLButtonElement> = (event) => {
    const id = event.currentTarget.id;
    document.getElementById(id)?.classList.add("hidden");
    removeStatusToast(Number(id));
  };

  return (
    <>
      <div className=" fixed box-border top-3 right-3">
        {statusToasts?.map((toast) => (
          <div
            className={`bg-transparent shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3 ${styles["toast-animation-in"]}`}
            key={toast.id}
            id={toast.id.toString()}
            aria-live="assertive"
            aria-atomic="true"
            data-mdb-autohide="false"
          >
            <div
              className={`${
                toast.type === toastType.error ? "bg-red-600" : "bg-green-600"
              } flex justify-between items-center py-2 px-3 bg-clip-padding border-b ${
                toast.type === toastType.error
                  ? "border-red-500"
                  : "border-green-500"
              } rounded-t-lg`}
            >
              <p className="font-bold text-white flex items-center">
                <img
                  className="invert h-4 inline-block pr-2"
                  src={
                    toast.type === toastType.error ? "/cross.svg" : "/check.svg"
                  }
                />
                {toast.type.toString()}
              </p>
              <div className="flex items-center">
                <button
                  type="button"
                  id={toast.id.toString()}
                  onClick={deleteToast}
                  className="btn-close btn-close-white box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline font-bold"
                  data-mdb-dismiss="toast"
                  aria-label="Close"
                >
                  X
                </button>
              </div>
            </div>
            <div
              className={`p-3 ${
                toast.type === toastType.error ? "bg-red-600" : "bg-green-600"
              } rounded-b-lg break-words text-white`}
            >
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Toast;
