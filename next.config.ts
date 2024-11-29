/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
	dest: 'public', // Destination folder for service worker and PWA files
	disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  });
  
  const nextConfig = {
	webpack: (config: any) => {
	  config.resolve.alias = {
		...config.resolve.alias,
		canvas: false, // Ignore `canvas` during builds
	  };
	  return config;
	},
  };
  
  module.exports = withPWA(nextConfig);
  