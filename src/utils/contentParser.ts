import type { EditorData } from '../config/types'

/**
 * Default empty editor data
 */
const EMPTY_EDITOR_DATA: EditorData = {
  blocks: []
}

/**
 * Parse JSON string to Editor.js data format
 * Returns empty data if parsing fails
 */
export function parseEditorContent(content: string): EditorData {
  if (!content) {
    return EMPTY_EDITOR_DATA
  }

  try {
    const parsed = JSON.parse(content)
    return parsed as EditorData
  } catch (error) {
    console.error('Error parsing editor content:', error)
    return EMPTY_EDITOR_DATA
  }
}

/**
 * Stringify Editor.js data to JSON
 * Returns empty string if stringification fails
 */
export function stringifyEditorContent(data: EditorData): string {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.error('Error stringifying editor content:', error)
    return ''
  }
}

/**
 * Check if two JSON strings represent the same content
 * Useful for preventing unnecessary updates
 */
export function isSameContent(content1: string, content2: string): boolean {
  return content1 === content2
}
