import { Inter } from 'next/font/google';
import { Orbitron } from 'next/font/google';
import './global.css';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import DotCursor from '@/components/common/cursors/dorCursor';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'] });

export const metadata = {
  title: 'OZONE-REALM',
  description: 'play and enjoy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${orbitron.className}`}>
      <body className='relative cursor-none'>
        <Navbar />
        <DotCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}
