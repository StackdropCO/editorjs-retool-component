import React, { useEffect, useRef, useMemo, useState } from 'react'
import type { FC } from 'react'
import EditorJS from '@editorjs/editorjs'
import { Retool } from '@tryretool/custom-component-support'
import { createClient } from '@supabase/supabase-js'
import { debounce } from 'lodash'
import ShortUniqueId from 'short-unique-id'

import { useEditorTools, createLinkConfig } from '../hooks/useEditorTools'
import { parseEditorContent, stringifyEditorContent, isSameContent } from '../utils/contentParser'
import { isSupabaseConfigured, deleteImageFromSupabase } from '../utils/supabaseUploader'
import { createImageConfig } from '../config/toolConfigs'
import { initializeAllPlugins } from '../utils/editorPlugins'
import type { ToolEnableStates, PluginEnableStates } from '../config/types'
import type Undo from 'editorjs-undo'
import "../style.css"

/**
 * Main Editor.js component for Retool
 * Provides a configurable rich text editor with multiple formatting tools
 */
export const EditorComponent: FC = () => {
  // Refs for editor management
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<EditorJS | null>(null)
  const debounceTimeout = useRef<number>()
  const prevImagesRef = useRef<string[]>([])
  const undoInstance = useRef<Undo | null>(null)

  // Content and styling states from Retool
  const [content, setContent] = Retool.useStateString({
    name: 'content',
    label: 'Editor content',
    description: 'This is the value of the editor'
  })

  const [backgroundColor] = Retool.useStateString({
    name: 'backgroundColor',
    label: 'Background color',
    description: 'Background color of the editor'
  })

  const [textColor] = Retool.useStateString({
    name: 'textColor',
    label: 'Text color',
    description: 'Text color of the editor'
  })

  // Tool enable states from Retool
  const [enableHeader] = Retool.useStateBoolean({
    name: 'enableHeader',
    initialValue: false,
    description: 'Enables Headers',
    label: 'Header',
    inspector: 'checkbox'
  })

  const [enableList] = Retool.useStateBoolean({
    name: 'enableList',
    initialValue: false,
    description: 'Enables Lists',
    label: 'List',
    inspector: 'checkbox'
  })

  const [enableQuote] = Retool.useStateBoolean({
    name: 'enableQuote',
    initialValue: false,
    description: 'Enables Quotes',
    label: 'Quote',
    inspector: 'checkbox'
  })

  const [enableCode] = Retool.useStateBoolean({
    name: 'enableCode',
    initialValue: false,
    description: 'Enables Code',
    label: 'Code',
    inspector: 'checkbox'
  })

  const [enableInlineCode] = Retool.useStateBoolean({
    name: 'enableInlineCode',
    initialValue: false,
    description: 'Enables Inline Code',
    label: 'Inline Code',
    inspector: 'checkbox'
  })

  const [enableMarker] = Retool.useStateBoolean({
    name: 'enableMarker',
    initialValue: false,
    description: 'Enables Marker',
    label: 'Marker',
    inspector: 'checkbox'
  })

  const [enableDelimiter] = Retool.useStateBoolean({
    name: 'enableDelimiter',
    initialValue: false,
    description: 'Enables Delimiter',
    label: 'Delimiter',
    inspector: 'checkbox'
  })

  const [enableEmbed] = Retool.useStateBoolean({
    name: 'enableEmbed',
    initialValue: false,
    description: 'Enables Embed',
    label: 'Embed',
    inspector: 'checkbox'
  })

  const [enableTable] = Retool.useStateBoolean({
    name: 'enableTable',
    initialValue: false,
    description: 'Enables Table',
    label: 'Table',
    inspector: 'checkbox'
  })

  const [enableWarning] = Retool.useStateBoolean({
    name: 'enableWarning',
    initialValue: false,
    description: 'Enables Warning',
    label: 'Warning',
    inspector: 'checkbox'
  })

  const [enableLink] = Retool.useStateBoolean({
    name: 'enableLink',
    initialValue: true,
    description: 'Enables Link Tool (users can manually enter link title and description)',
    label: 'Link Tool',
    inspector: 'checkbox'
  })

  const [enableUnderline] = Retool.useStateBoolean({
    name: 'enableUnderline',
    initialValue: false,
    description: 'Enables Underline',
    label: 'Underline',
    inspector: 'checkbox'
  })

  const [enableChecklist] = Retool.useStateBoolean({
    name: 'enableChecklist',
    initialValue: false,
    description: 'Enables Checklist',
    label: 'Checklist',
    inspector: 'checkbox'
  })

  const [enableImage] = Retool.useStateBoolean({
    name: 'enableImage',
    initialValue: false,
    description: 'Enables Image Upload (requires Supabase configuration)',
    label: 'Image Upload',
    inspector: 'checkbox'
  })

  // Supabase configuration for image upload
  const [supabaseUrl] = Retool.useStateString({
    name: 'supabaseUrl',
    label: 'Supabase URL',
    description: 'Supabase project URL (e.g., https://xxxxx.supabase.co)',
    initialValue: ''
  })

  const [supabaseBucket] = Retool.useStateString({
    name: 'supabaseBucket',
    label: 'Supabase Bucket',
    description: 'Supabase storage bucket name',
    initialValue: ''
  })

  const [supabaseApiKey] = Retool.useStateString({
    name: 'supabaseApiKey',
    label: 'Supabase API Key',
    description: 'Supabase service_role or anon key',
    initialValue: ''
  })

  const [articleId] = Retool.useStateString({
    name: 'articleId',
    label: 'Article ID',
    description: 'Optional: ID for organizing images (e.g., articles/[id]/content/)',
    initialValue: ''
  })

  // LinkPreview API configuration for automatic link fetching
  const [linkPreviewApiKey] = Retool.useStateString({
    name: 'linkPreviewApiKey',
    label: 'LinkPreview API Key',
    description: 'Optional: Your LinkPreview.net API key for automatic link metadata fetching',
    initialValue: ''
  })

  const [newImagePaths, setNewImagePaths] = Retool.useStateArray({
    name: 'newImagePaths',
    label: 'New Image Paths',
    description: 'Tracks uploaded image paths (for cleanup)',
    inspector: 'hidden',
    initialValue: []
  })

  // Priority 2 tool states
  const [enableNestedList] = Retool.useStateBoolean({
    name: 'enableNestedList',
    initialValue: false,
    description: 'Enables Nested Lists (multi-level hierarchical lists)',
    label: 'Nested List',
    inspector: 'checkbox'
  })

  const [enableSimpleImage] = Retool.useStateBoolean({
    name: 'enableSimpleImage',
    initialValue: true,
    description: 'Enables Simple Image (paste image URLs)',
    label: 'Simple Image',
    inspector: 'checkbox'
  })

  const [enableMermaid] = Retool.useStateBoolean({
    name: 'enableMermaid',
    initialValue: false,
    description: 'Enables Mermaid diagrams (flowcharts, sequence diagrams, etc.)',
    label: 'Mermaid',
    inspector: 'checkbox'
  })

  // Plugin states
  const [enableUndo] = Retool.useStateBoolean({
    name: 'enableUndo',
    initialValue: true,
    description: 'Enables Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)',
    label: 'Undo/Redo',
    inspector: 'checkbox'
  })

  const [enableDragDrop] = Retool.useStateBoolean({
    name: 'enableDragDrop',
    initialValue: true,
    description: 'Enables Drag & Drop block reordering',
    label: 'Drag & Drop',
    inspector: 'checkbox'
  })

  // Auto-save draft feature
  const [autoSaveDraft] = Retool.useStateBoolean({
    name: 'autoSaveDraft',
    initialValue: true,
    description: 'Automatically save drafts to localStorage',
    label: 'Auto Save Draft',
    inspector: 'checkbox'
  })

  // Use React useState for editorId (initialized from localStorage, not Retool state)
  const [editorId] = useState<string>(() => {
    // Initialize from localStorage or generate new
    const storedId = localStorage.getItem('retool-editor-id')
    if (storedId) {
      return storedId
    } else {
      const uid = new ShortUniqueId({ length: 10 })
      const newId = uid.rnd()
      localStorage.setItem('retool-editor-id', newId)
      return newId
    }
  })

  // Local state for draft badge visibility
  const [isDraft, setIsDraft] = useState(false)

  // Build tool enable states object
  const toolEnableStates: ToolEnableStates = {
    enableHeader,
    enableList,
    enableQuote,
    enableCode,
    enableInlineCode,
    enableMarker,
    enableDelimiter,
    enableEmbed,
    enableTable,
    enableWarning,
    enableLink,
    enableUnderline,
    enableChecklist,
    enableImage,
    enableNestedList,
    enableSimpleImage,
    enableMermaid
  }

  // Build plugin enable states object
  const pluginEnableStates: PluginEnableStates = {
    enableUndo,
    enableDragDrop
  }

  // Storage key for localStorage
  const storageKey = `retool-editor-draft-${editorId}`

  // Save content to localStorage
  const saveToLocalStorage = (data: string) => {
    if (autoSaveDraft && storageKey) {
      try {
        localStorage.setItem(storageKey, data)
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  // Load content from localStorage
  const loadFromLocalStorage = (): string | null => {
    if (autoSaveDraft && storageKey) {
      try {
        return localStorage.getItem(storageKey)
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        return null
      }
    }
    return null
  }

  // Debounced save to localStorage
  const debouncedSaveToLocalStorage = useMemo(
    () => debounce((data: string) => saveToLocalStorage(data), 500),
    [autoSaveDraft, storageKey]
  )

  // Supabase configuration object
  const supabaseConfig = {
    url: supabaseUrl,
    bucket: supabaseBucket,
    apiKey: supabaseApiKey,
    articleId: articleId
  }

  // Create Supabase client only if configuration is valid (memoized)
  const supabase = useMemo(() => {
    if (isSupabaseConfigured(supabaseConfig)) {
      return createClient(supabaseUrl, supabaseApiKey)
    }
    return null
  }, [supabaseUrl, supabaseApiKey, supabaseConfig])

  // Initialize image paths ref on mount
  useEffect(() => {
    setNewImagePaths([])
    prevImagesRef.current = []
  }, [])

  // Delete image from Supabase and update state
  const deleteImage = async (filePath: string) => {
    if (!supabase) {
      console.warn('Cannot delete image: Supabase client not configured')
      return
    }
    try {
      await deleteImageFromSupabase(supabase, supabaseBucket, filePath)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNewImagePaths(newImagePaths.filter((path: any) => path !== filePath))
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  // Get dynamically built tools object (without image tool initially)
  const baseTools = useEditorTools(toolEnableStates)

  // Conditionally add image tool and link tool based on configuration
  const tools = useMemo(() => {
    const allTools = { ...baseTools }

    // Only add image tool if enabled, Supabase is properly configured, AND client exists
    if (enableImage && supabase && isSupabaseConfigured(supabaseConfig)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allTools.image = createImageConfig(supabase, supabaseConfig, (path: string) => {
        // Track new image paths
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setNewImagePaths([...newImagePaths, path] as any)
      })
    }

    // Configure link tool with LinkPreview API key (overrides baseTools linkTool if present)
    if (enableLink) {
      allTools.linkTool = createLinkConfig(linkPreviewApiKey)
    }

    return allTools
  }, [baseTools, enableImage, supabaseConfig, supabase, newImagePaths, enableLink, linkPreviewApiKey])

  /**
   * Handler for editor changes
   * Debounces updates and handles image deletion tracking
   */
  const handleEditorChange = async () => {
    if (!editorInstance.current) return

    try {
      const data = await editorInstance.current.save()
      const jsonData = stringifyEditorContent(data)

      // Extract all image paths from the new content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newPaths = data.blocks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((b: any) => b.type === 'image')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((b: any) => b.data.file.path as string)
        .filter((path: string) => path) // Filter out undefined/empty paths

      // Compare to the previous image paths
      const deletedPaths = prevImagesRef.current.filter((p) => !newPaths.includes(p))

      // Delete any images that were removed
      await Promise.all(deletedPaths.map((p) => deleteImage(p)))

      // Update the ref with current paths
      prevImagesRef.current = newPaths

      // Clear any existing timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }

      // Debounce the content update (1 second)
      debounceTimeout.current = setTimeout(() => {
        // Only update content if it's different to prevent infinite loops
        if (!isSameContent(jsonData, content)) {
          setContent(jsonData)
          // Also save to localStorage for draft persistence
          debouncedSaveToLocalStorage(jsonData)
        }
      }, 1000)
    } catch (error) {
      console.error('Error saving editor data:', error)
    }
  }

  /**
   * Initialize or reinitialize the editor when tools change
   */
  useEffect(() => {
    if (!editorRef.current) return

    // Initialize new editor
    if (!editorInstance.current) {
      // Determine initial content: DB content takes priority over localStorage
      let initialContent = content
      let loadedFromDraft = false

      if (!content || content.trim() === '' || content === '{}' || content === '{"blocks":[]}') {
        // No DB content - try loading from localStorage
        const draft = loadFromLocalStorage()
        if (draft) {
          initialContent = draft
          loadedFromDraft = true
        }
      } else {
        // DB content exists - save it to localStorage (overwrite any draft)
        saveToLocalStorage(content)
      }

      // Update draft badge visibility
      setIsDraft(loadedFromDraft)

      const parsedData = parseEditorContent(initialContent)

      // Initialize prevImagesRef with existing images from content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialPaths = parsedData.blocks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((b: any) => b.type === 'image')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((b: any) => b.data?.file?.path as string)
        .filter((path: string) => path) // Filter out undefined/empty paths
      prevImagesRef.current = initialPaths

      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        placeholder: 'Start typing here...',
        data: parsedData,
        tools,
        onChange: handleEditorChange,
        onReady: () => {
          // Initialize plugins after editor is ready
          if (editorInstance.current) {
            undoInstance.current = initializeAllPlugins(
              editorInstance.current,
              pluginEnableStates.enableUndo,
              pluginEnableStates.enableDragDrop,
              parsedData
            )
          }
        }
      })
    } else {
      // Editor exists - destroy and recreate with new tools
      const currentEditor = editorInstance.current
      const saveAndReinitialize = async () => {
        try {
          const currentData = await currentEditor.save()
          currentEditor.destroy()

          editorInstance.current = new EditorJS({
            holder: editorRef.current!,
            placeholder: 'Start typing here...',
            data: currentData,
            tools,
            onChange: handleEditorChange,
            onReady: () => {
              // Initialize plugins after editor is ready
              if (editorInstance.current) {
                undoInstance.current = initializeAllPlugins(
                  editorInstance.current,
                  pluginEnableStates.enableUndo,
                  pluginEnableStates.enableDragDrop,
                  currentData
                )
              }
            }
          })
        } catch (error) {
          console.error('Error reinitializing editor:', error)
        }
      }
      saveAndReinitialize()
    }

    // Cleanup function
    return () => {
      // Clear undo instance reference (no destroy method exists for editorjs-undo)
      undoInstance.current = null

      // Cleanup editor instance
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy()
          editorInstance.current = null
        } catch (err) {
          console.error('Error destroying editor instance:', err)
        }
      }
    }
  }, [
    enableHeader,
    enableList,
    enableQuote,
    enableCode,
    enableInlineCode,
    enableMarker,
    enableDelimiter,
    enableEmbed,
    enableTable,
    enableWarning,
    enableLink,
    enableUnderline,
    enableChecklist,
    enableImage,
    enableNestedList,
    enableSimpleImage,
    enableMermaid,
    pluginEnableStates.enableUndo,
    pluginEnableStates.enableDragDrop
  ])

  return (
    <div style={{ fontFamily: 'Lexend, sans-serif', position: 'relative' }}>
      {isDraft && (
        <div className="editor-draft-badge">
          Draft
        </div>
      )}
      <div
        id="editorjs"
        ref={editorRef}
        style={{
          padding: '16px',
          height: '100%',
          backgroundColor: backgroundColor || '#f8fafc',
          color: textColor || '#000',
          borderRadius: '8px',
          // @ts-ignore - CSS custom properties
          '--editor-bg-color': backgroundColor || '#f8fafc'
        }}
      />
    </div>
  )
}
