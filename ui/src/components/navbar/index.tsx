import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="text-white flex items-center justify-between px-10 py-4 w-full fixed top-0 z-10 bg-white/10 backdrop-blur">
      <h1 className="text-6xl font-bold">OZONE-REALM</h1>
      <div className="flex gap-10 text-xl">
        <ul className="flex gap-10">
          <ol className="animated_text group relative">
            <Link href={"#"} className="inline-block">
              <span className="relative z-10">HOME</span>
            </Link>
          </ol>
          <ol className="animated_text group relative">
            <Link href={"#"} className="inline-block">
              <span className="relative z-10">ABOUT</span>
            </Link>
          </ol>
          <ol className="animated_text group relative">
            <Link href={"#"} className="inline-block">
              <span className="relative z-10">MARKETPLACE</span>
            </Link>
          </ol>
          <ol className="animated_text group relative">
            <Link href={"#"} className="inline-block">
              <span className="relative z-10">DOCS</span>
            </Link>
          </ol>
        </ul>
        <button className="animated_text group relative">LOGIN</button>
      </div>
    </nav>
  );
}
