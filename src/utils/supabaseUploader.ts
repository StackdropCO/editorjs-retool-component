/**
 * Supabase image uploader utility for Editor.js Image tool
 */

import { SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  bucket: string
  apiKey: string
  articleId?: string
}

/**
 * Validate Supabase configuration
 * All fields must be non-empty strings
 */
export function isSupabaseConfigured(config: SupabaseConfig): boolean {
  return Boolean(
    config.url &&
      config.bucket &&
      config.apiKey &&
      config.url.trim() !== '' &&
      config.bucket.trim() !== '' &&
      config.apiKey.trim() !== ''
  )
}

/**
 * Upload image to Supabase storage using Supabase JS SDK
 * Returns the public URL and path of the uploaded image
 */
export async function uploadImageToSupabase(
  file: File,
  supabaseClient: SupabaseClient,
  config: SupabaseConfig,
  onNewImagePath?: (path: string) => void
): Promise<{ success: number; file: { url: string; path: string } }> {
  try {
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')

    // Generate filename with optional article organization
    const fileName = config.articleId
      ? `articles/${config.articleId}/content/${safeName}`
      : `uploads/${Date.now()}-${safeName}`

    // Upload to Supabase
    const { error } = await supabaseClient.storage.from(config.bucket).upload(fileName, file)

    if (error) {
      console.error('Error uploading image:', error)
      throw error
    }

    // Track new image path
    if (onNewImagePath) {
      onNewImagePath(fileName)
    }

    // Get the public URL
    const {
      data: { publicUrl }
    } = supabaseClient.storage.from(config.bucket).getPublicUrl(fileName)

    return {
      success: 1,
      file: {
        url: publicUrl,
        path: fileName
      }
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: 0,
      file: {
        url: '',
        path: ''
      }
    }
  }
}

/**
 * Delete image from Supabase storage
 */
export async function deleteImageFromSupabase(
  supabaseClient: SupabaseClient,
  bucket: string,
  filePath: string
): Promise<void> {
  const { error } = await supabaseClient.storage.from(bucket).remove([filePath])

  if (error) {
    console.error('Failed to delete', filePath, error)
    throw error
  }
}

/**
 * Create uploader function for Editor.js Image tool
 */
export function createSupabaseUploader(
  supabaseClient: SupabaseClient,
  config: SupabaseConfig,
  onNewImagePath?: (path: string) => void
) {
  return async (file: File) => {
    return uploadImageToSupabase(file, supabaseClient, config, onNewImagePath)
  }
}
