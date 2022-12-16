import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

function Header() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between pl-4 pr-3 md:pr-8 xl:pr-12 bg-gray-900">
      <div className="text-4xl text-center p-4">Manga Recommender</div>
      <div>
        {session && (
          <div className="flex items-center gap-10">
            <div className="capitalize">{session.user?.name}</div>
            <button
              onClick={() => signOut()}
              className="px-4 py-1 border rounded-full hover:bg-blue-900 transition"
            >
              Logout
            </button>
          </div>
        )}
        {!session && (
          <button
            onClick={() => signIn("myanimelist")}
            className="px-4 py-1 border rounded-full hover:bg-blue-900 transition"
          >
            Login with MyAnimeList
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;