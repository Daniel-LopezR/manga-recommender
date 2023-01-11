import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

function Header() {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 flex flex-wrap items-center justify-center md:justify-between pl-4 pr-3 md:pr-8 xl:pr-12 bg-gray-900 z-10 ">
      <div className="text-4xl text-center p-4">Manga Recommender</div>
      <div>
        {session ? (
          <div className="flex items-center md:gap-10 gap-3 py-3">
            <div className="capitalize">{session.user?.name}</div>
            <Link
              className="transition text-shadow text-center px-4 py-1 border rounded-full hover:bg-blue-900"
              href={`https://myanimelist.net/mangalist/${session.user?.name}`}
              target={"_blank"}
            >
              Your List!
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-1 border rounded-full hover:bg-blue-900 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="py-3">
            <button
              onClick={() => signIn("myanimelist")}
              className="px-4 py-1 border rounded-full hover:bg-blue-900 transition"
            >
              Login with MyAnimeList
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
