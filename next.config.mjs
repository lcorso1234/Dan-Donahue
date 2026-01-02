import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the turbopack root to the repository's project directory to avoid
  // warnings about inferred workspace roots when multiple lockfiles exist.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
