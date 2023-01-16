import Image from "next/image";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-screen flex items-center justify-center p-4 bg-gray-900">
      <a
        className="flex items-center"
        href="https://github.com/Daniel-LopezR/manga-recommender"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          className="invert inline-block"
          width={20}
          height={20}
          src={"/github.svg"}
          alt={"GitHub"}
        />
        <span className="pl-2">GitHub</span>
        
      </a>
    </footer>
  );
}
