import GameBoard from "@/components/Games/GameBoard";

export default function Page() {
  return (
    <section className="h-screen w-full grid grid-rows-[auto_1fr_auto] px-4 py-2">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-xl md:text-3xl font-bold text-indigo-800">
          OZONE-REALM
        </h1>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-items-center h-full">
        {/* Opponent Video */}
        <div className="w-full max-w-[200px] aspect-video bg-black rounded-md relative shadow-md">
          <span className="absolute bottom-1 left-2 text-white text-xs">Opponent</span>
        </div>

        {/* Game Board */}
        <div className="w-full max-w-[250px] aspect-square flex items-center justify-center">
          <GameBoard />
        </div>

        {/* Your Video */}
        <div className="w-full max-w-[200px] aspect-video bg-gray-800 rounded-md relative shadow-md">
          <span className="absolute bottom-1 left-2 text-white text-xs">You</span>
        </div>
      </main>

      {/* Controls */}
      <footer className="flex justify-center gap-4 py-2">
        <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
          🎤 Voice
        </button>
        <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition">
          📞 End
        </button>
      </footer>
    </section>
  );
}
