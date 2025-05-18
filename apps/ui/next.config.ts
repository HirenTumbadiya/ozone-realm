import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

type ExtendedNextConfig = NextConfig & { reactStrictMode?: boolean };

const nextConfig: ExtendedNextConfig = withPWA({
  dest: 'public',
  register: true, 
  skipWaiting: true,

});

nextConfig.reactStrictMode = true;

export default nextConfig;
