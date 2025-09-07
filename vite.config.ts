import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Explicitly define all environment variables for Vite
    // Cloudinary
    'import.meta.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.VITE_CLOUDINARY_CLOUD_NAME),
    'import.meta.env.VITE_CLOUDINARY_API_KEY': JSON.stringify(process.env.VITE_CLOUDINARY_API_KEY),
    'import.meta.env.VITE_CLOUDINARY_API_SECRET': JSON.stringify(process.env.VITE_CLOUDINARY_API_SECRET),
    'import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET': JSON.stringify(process.env.VITE_CLOUDINARY_UPLOAD_PRESET),
    
    // AssemblyAI
    'import.meta.env.VITE_ASSEMBLY_AI_API_KEY': JSON.stringify(process.env.VITE_ASSEMBLY_AI_API_KEY),
    
    // OpenRouter
    'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(process.env.VITE_OPENROUTER_API_KEY),
    
    // Hugging Face
    'import.meta.env.VITE_HUGGING_FACE_TOKEN': JSON.stringify(process.env.VITE_HUGGING_FACE_TOKEN),
    
    // Note: Supabase is commented out in .env, so we won't include it here
  },
});
