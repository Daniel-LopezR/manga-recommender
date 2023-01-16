import {
  StatusToastContext,
  StatusToastContextType,
} from "@/context/statusToastContext";
import { toastType } from "@/components/Toast/Toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";

type status = {
  id: string;
  name: string;
  color: {
    border: string;
    bg: string;
    hoverBg: string;
  };
};

function StatusButton({
  status,
  statusSelected,
  mangaId,
  updateStatus,
  deleteButton,
}: {
  status: status;
  statusSelected: string;
  mangaId: number;
  updateStatus: (statusClicked: string) => void;
  deleteButton?: boolean;
}) {
  const { addStatusToast } = useContext(
    StatusToastContext
  ) as StatusToastContextType;
  const { data: session } = useSession();

  const changeStatus = () => {
    if (deleteButton) {
      if (status.id === "delete") {
        axios
          .patch(`/api/userMangaList/`, {
            id: mangaId,
            access_token: session!.user!.token,
            method: "DELETE",
          })
          .then(() => {
            updateStatus("delete");
            addStatusToast(
              toastType.success,
              "status",
              "Manga was sucessfully deleted from your list!"
            );
          });
      }
    } else {
      axios
        .patch(`/api/userMangaList/`, {
          status: status.id,
          id: mangaId,
          access_token: session!.user!.token,
        })
        .then((response) => {
          updateStatus(response.data.status);
          addStatusToast(
            toastType.success,
            "status",
            `Manga status sucessfully changed to ${status.name}!`
          );
        });
    }
  };

  return (
    <>
      <div
        className={`p-2 text-center border rounded-xl transition cursor-pointer ${
          status.color.border
        } ${
          statusSelected === status.id ? status.color.bg : status.color.hoverBg
        } `}
        onClick={changeStatus}
        key={status.id}
      >
        {status.name}
      </div>
    </>
  );
}

export default StatusButton;
