import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center p-4 bg-gray-900">
      <a
        className="flex items-center"
        href="https://github.com/Daniel-LopezR/manga-recommender"
        target="_blank"
      >
        <Image
          className="h-auto invert inline-block"
          width={20}
          height={0}
          src={"/github.svg"}
          alt={"GitHub"}
        />
        <span className="pl-2">GitHub</span>
        
      </a>
    </footer>
  );
}
