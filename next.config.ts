/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config: any) => {
	  config.resolve.alias = {
		...config.resolve.alias,
		'canvas': false, // Ignore `canvas` during builds
	  };
	  return config;
	},
  };
  
  module.exports = nextConfig;
  