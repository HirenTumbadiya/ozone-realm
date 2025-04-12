import RobotRender from '@/components/home/robotRender';

export default function Index() {
  return (
    <main className="text-white font-bold text-2xl">
      <section className="w-full h-full flex items-center hero-section md:p-28">
        <h1 className="text-9xl md:max-w-5xl">
          Enter the Realm. Stay for the Game.
        </h1>
        <div className="absolute h-screen w-screen">
          <RobotRender />
        </div>
      </section>
      <section className="w-full h-full md:p-28 text-white">
        <div className='text-pretty text-6xl text-center pb-20'>🚀 Let the Games Begin</div>
        <div className="rounded-3xl border p-5 flex flex-col justify-between items-center w-full h-full">
          <div>
            <h2 className="font-extrabold text-5xl">Tic Tac Toe</h2>
            <div>
              <p className="text-2xl">
                Play online with friends, track your win streaks, and join the
                global leaderboard.
              </p>
            </div>
          </div>
          <button className="border px-10 py-2 rounded-full">Start Now</button>
        </div>
      </section>
    </main>
  );
}
