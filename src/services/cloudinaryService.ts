// Cloudinary Upload Service using browser-compatible fetch API

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  // Add other fields you might need from the response
  [key: string]: any;
}

export async function uploadToCloudinary(file: File): Promise<string> {
  // Debug: Log all environment variables
  console.log('Environment Variables:', JSON.stringify(import.meta.env, null, 2));
  
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  console.log('Cloudinary Config:', { cloudName, uploadPreset });
  
  if (!cloudName || !uploadPreset) {
    console.error('Missing Cloudinary configuration. Please check your .env file and Vite configuration.');
    throw new Error('Missing Cloudinary configuration');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  // Remove unsupported parameters for unsigned uploads
  // Only these parameters are allowed with unsigned uploads:
  // upload_preset, callback, public_id, folder, asset_folder, tags, context,
  // metadata, face_coordinates, custom_coordinates, source, filename_override,
  // manifest_transformation, manifest_json, template, template_vars, regions, public_id_prefix

  try {
    // Use the regional upload endpoint for better performance
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    
    // Simple fetch without timeout
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const data: CloudinaryResponse = await response.json();
    
    if (!data.secure_url) {
      throw new Error('No secure URL returned from Cloudinary');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during upload');
  }
}

// Note: For client-side, we typically don't handle deletion from the client
// as it would require exposing the API secret. Deletions should be handled server-side.
export async function deleteFromCloudinary(): Promise<void> {
  console.warn('Deleting from Cloudinary should be handled server-side');
  return Promise.resolve();
}
