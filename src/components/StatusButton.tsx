import axios from "axios";
import { useSession } from "next-auth/react";
import React, { MouseEventHandler, useState } from "react";

type status = {
  id: string;
  name: string;
  color: string;
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
  const { data: session } = useSession();
  const changeStatus = async () => {
    if (deleteButton) {
      axios
      .patch(`/api/userMangaList/`, {
        id: mangaId,
        access_token: session!.user!.token,
        method: "DELETE"
      })
      .then(() => {
        updateStatus("delete");
      });
    } else {
      axios
        .patch(`/api/userMangaList/`, {
          status: status.id,
          id: mangaId,
          access_token: session!.user!.token,
        })
        .then((response) => {
          updateStatus(response.data.status);
        });
    }
  };
  return (
    <>
      <div
        className={`p-2 text-center border rounded-xl transition cursor-pointer ${
          "border-" + status.color + "-500"
        } ${
          statusSelected === status.id
            ? "bg-" + status.color + "-500"
            : "hover:bg-" + status.color + "-500"
        } `}
        onClick={changeStatus}
      >
        {status.name}
      </div>
    </>
  );
}

export default StatusButton;
