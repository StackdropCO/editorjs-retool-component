/**
 * Editor.js plugins utility
 * Handles initialization of plugins that enhance the entire editor
 * (Undo/Redo, Drag & Drop, etc.)
 */

import EditorJS from '@editorjs/editorjs'
import Undo from 'editorjs-undo'
import DragDrop from 'editorjs-drag-drop'
import type { EditorData } from '../config/types'

/**
 * Initialize Undo/Redo plugin for Editor.js
 * Adds keyboard shortcuts: Ctrl+Z (undo) and Ctrl+Shift+Z (redo)
 */
export function initializeUndo(editor: EditorJS, _initialData?: EditorData): Undo | null {
  try {
    const undo = new Undo({
      editor,
      maxLength: 50 // Maximum number of undo/redo steps
    })

    // Initialize undo after a longer delay to ensure editor is fully ready
    setTimeout(() => {
      try {
        // Only initialize if editor is ready and has blocks
        if (editor && editor.blocks) {
          undo.initialize()
        }
      } catch (error) {
        console.error('Error during delayed undo initialization:', error)
      }
    }, 500)

    return undo
  } catch (error) {
    console.error('Error initializing Undo plugin:', error)
    return null
  }
}

/**
 * Initialize Drag & Drop plugin for Editor.js
 * Allows users to reorder blocks by dragging them
 */
export function initializeDragDrop(editor: EditorJS): void {
  try {
    // @ts-ignore - DragDrop package lacks proper TypeScript definitions
    new DragDrop(editor)
  } catch (error) {
    console.error('Error initializing DragDrop plugin:', error)
  }
}

/**
 * Initialize all editor plugins
 * @param editor - Editor.js instance
 * @param enableUndo - Whether to enable Undo/Redo
 * @param enableDragDrop - Whether to enable Drag & Drop
 * @param initialData - Initial editor data for undo plugin
 * @returns Undo instance (for cleanup) or null
 */
export function initializeAllPlugins(
  editor: EditorJS,
  enableUndo: boolean = true,
  enableDragDrop: boolean = true,
  initialData?: EditorData
): Undo | null {
  let undoInstance: Undo | null = null

  if (enableUndo) {
    undoInstance = initializeUndo(editor, initialData)
  }

  if (enableDragDrop) {
    initializeDragDrop(editor)
  }

  return undoInstance
}
