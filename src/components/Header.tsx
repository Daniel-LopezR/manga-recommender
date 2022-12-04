export default function Header() {
  return (
    <div className="flex items-center justify-between pl-4 pr-3 md:pr-8 xl:pr-12 bg-gray-900">
      <div className="text-4xl text-center p-4">Manga Recommender</div>
      {/* This has to change when user logs in */}
      <button className="px-4 py-1 border rounded-full hover:bg-blue-900 transition">
        Login
      </button>
    </div>
  );
}
