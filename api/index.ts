// Re-export the Vercel serverless handler from the NestJS entry point.
// Vercel's @vercel/node builder compiles this file and follows the import.
export { default } from '../src/main';
