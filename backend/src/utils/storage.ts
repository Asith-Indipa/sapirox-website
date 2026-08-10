import { supabase } from '../config/supabase';
import fs from 'fs';
import path from 'path';

/**
 * Deletes a file from Supabase Storage or from the local uploads folder
 * based on its URL/path.
 * 
 * @param url The full URL of the file to delete
 * @param bucketName The name of the Supabase bucket (default: 'sapirox-uploads')
 */
export const deleteFileFromStorage = async (url: string | null | undefined, bucketName: string = 'sapirox-uploads'): Promise<void> => {
  if (!url) return;

  try {
    // 1. Check if it's a Supabase storage URL
    // A typical Supabase storage public URL looks like:
    // https://[project-ref].supabase.co/storage/v1/object/public/[bucket-name]/[filename]
    const publicUrlPrefix = `/storage/v1/object/public/${bucketName}/`;
    const index = url.indexOf(publicUrlPrefix);

    if (index !== -1) {
      const filePath = decodeURIComponent(url.substring(index + publicUrlPrefix.length));
      if (filePath) {
        console.log(`🗑️ Deleting file from Supabase storage: ${filePath}`);
        const { error } = await supabase.storage.from(bucketName).remove([filePath]);
        if (error) {
          console.error(`❌ Failed to delete file from Supabase storage: ${filePath}`, error);
        }
      }
      return;
    }

    // 2. Check if it's a local upload URL (fallback for old items)
    // A typical local upload URL looks like:
    // http://localhost:5000/uploads/[filename]
    const localUploadPrefix = '/uploads/';
    const localIndex = url.indexOf(localUploadPrefix);
    if (localIndex !== -1) {
      const fileName = url.substring(localIndex + localUploadPrefix.length);
      // Construct absolute path to the local file
      // Note: we are currently in src/utils, so the uploads folder is located at '../../uploads'
      const filePath = path.join(__dirname, '../../uploads', fileName);
      if (fs.existsSync(filePath)) {
        console.log(`🗑️ Deleting local file: ${filePath}`);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`❌ Failed to delete local file: ${filePath}`, err);
          }
        });
      }
    }
  } catch (error) {
    console.error(`❌ Error in deleteFileFromStorage utility:`, error);
  }
};
