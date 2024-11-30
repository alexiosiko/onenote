/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
	dest: 'public',
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
  

  