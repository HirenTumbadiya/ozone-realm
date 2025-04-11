import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <nav className="text-white flex items-center justify-between px-6 py-4 w-full fixed top-0 z-10 bg-white/10 backdrop-blur">
      <h1 className="text-6xl font-bold">OZONE-REALM</h1>
      <div className="flex gap-10 text-xl">
        <ul className="flex gap-10">
          <ol>HOME</ol>
          <ol>ABOUT</ol>
          <ol>MARKETPLACE</ol>
        </ul>
        <button>LOGIN</button>
      </div>
    </nav>
  );
}
