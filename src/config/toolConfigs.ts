import Header from '@editorjs/header'
import EditorjsList from '@editorjs/list'
import NestedList from '@editorjs/nested-list'
import Quote from '@editorjs/quote'
import Code from '@editorjs/code'
import InlineCode from '@editorjs/inline-code'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import LinkTool from '@editorjs/link'
import Underline from '@editorjs/underline'
import Paragraph from '@editorjs/paragraph'
import Checklist from '@editorjs/checklist'
import ImageTool from '@editorjs/image'
import SimpleImage from '@editorjs/simple-image'
import AlignmentTune from 'editorjs-text-alignment-blocktune'
import MermaidTool from 'editorjs-mermaid'
import { SimpleLinkTool } from '../utils/SimpleLinkTool'

import type { ToolConfig } from './types'
import type { SupabaseConfig } from '../utils/supabaseUploader'
import { createSupabaseUploader } from '../utils/supabaseUploader'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Paragraph tool configuration (always enabled)
 */
export const paragraphConfig: ToolConfig = {
  class: Paragraph,
  inlineToolbar: true,
  config: {
    placeholder: '',
    preserveBlank: true
  }
}

/**
 * Header tool configuration
 */
export const headerConfig: ToolConfig = {
  class: Header,
  inlineToolbar: true,
  shortcut: 'CMD+SHIFT+H',
  config: {
    levels: [1, 2, 3, 4],
    defaultLevel: 2
  }
}

/**
 * List tool configuration
 */
export const listConfig: ToolConfig = {
  class: EditorjsList,
  inlineToolbar: true,
  config: {
    defaultStyle: 'unordered',
    maxLevel: 3,
    counterTypes: ['numeric']
  }
}

/**
 * Quote tool configuration
 */
export const quoteConfig: ToolConfig = {
  class: Quote,
  inlineToolbar: true,
  shortcut: 'CMD+SHIFT+O',
  config: {
    quotePlaceholder: 'Enter a quote',
    captionPlaceholder: "Quote's author"
  }
}

/**
 * Code tool wrapper that disables paste handling to prevent interference with SimpleImage
 */
class CodeWithoutPaste extends Code {
  // Override pasteConfig to disable paste handling
  static get pasteConfig() {
    return false as any
  }
}

/**
 * Code tool configuration
 */
export const codeConfig: ToolConfig = {
  class: CodeWithoutPaste,
  config: {
    placeholder: 'Enter code here...'
  }
}

/**
 * Inline code tool configuration
 */
export const inlineCodeConfig: ToolConfig = {
  class: InlineCode,
  shortcut: 'CMD+SHIFT+M'
}

/**
 * Marker tool configuration
 */
export const markerConfig: ToolConfig = {
  class: Marker,
  shortcut: 'CMD+SHIFT+M'
}

/**
 * Delimiter tool configuration
 */
export const delimiterConfig: ToolConfig = {
  class: Delimiter,
  shortcut: 'CMD+SHIFT+D'
}

/**
 * Embed tool configuration
 */
export const embedConfig: ToolConfig = {
  class: Embed,
  inlineToolbar: true,
  config: {
    services: {
      youtube: true,
      codepen: {
        regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
        embedUrl:
          'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
        html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
        height: 300,
        width: 600,
        id: (groups: string[]) => groups.join('/embed/')
      }
    }
  }
}

/**
 * Table tool configuration
 */
export const tableConfig: ToolConfig = {
  class: Table,
  inlineToolbar: true,
  config: {
    rows: 2,
    cols: 3,
    maxRows: 5,
    maxCols: 5
  }
}

/**
 * Warning tool configuration
 */
export const warningConfig: ToolConfig = {
  class: Warning,
  inlineToolbar: true,
  shortcut: 'CMD+SHIFT+W',
  config: {
    titlePlaceholder: 'Title',
    messagePlaceholder: 'Message'
  }
}

/**
 * Link tool configuration
 *
 * Creates standalone link blocks with rich previews.
 * Without an endpoint configured, users must manually enter title and description.
 * With an endpoint, it will automatically fetch metadata.
 */
export const linkConfig: ToolConfig = {
  class: LinkTool,
  config: {
    // No endpoint by default - users enter details manually
    // Can be overridden by passing endpoint in component configuration
  }
}

/**
 * Create Link tool configuration with LinkPreview API integration
 * @param apiKey - LinkPreview API key for automatic link fetching
 * @returns Link tool configuration
 */
export function createLinkConfig(apiKey?: string): ToolConfig {
  return {
    class: SimpleLinkTool,
    config: {
      apiKey: apiKey || ''
    }
  }
}

/**
 * Underline tool configuration
 * Note: This tool uses simplified configuration
 */
export const underlineConfig = Underline

/**
 * Checklist tool configuration
 */
export const checklistConfig: ToolConfig = {
  class: Checklist,
  inlineToolbar: true
}


/**
 * Create Image tool configuration with Supabase uploader
 * @param supabaseClient - Supabase client instance
 * @param supabaseConfig - Supabase configuration (URL, bucket, API key, articleId)
 * @param onNewImagePath - Callback when new image is uploaded
 * @returns Image tool configuration
 */
export function createImageConfig(
  supabaseClient: SupabaseClient,
  supabaseConfig: SupabaseConfig,
  onNewImagePath?: (path: string) => void
): ToolConfig {
  return {
    class: ImageTool,
    config: {
      uploader: {
        uploadByFile: createSupabaseUploader(supabaseClient, supabaseConfig, onNewImagePath)
      }
    }
  }
}

/**
 * Nested List tool configuration (enhanced multi-level lists)
 * Better alternative to the basic list tool
 */
export const nestedListConfig: ToolConfig = {
  class: NestedList,
  inlineToolbar: true,
  config: {
    defaultStyle: 'unordered'
  }
}

/**
 * Simple Image tool configuration (URL-based images)
 * Allows pasting image URLs without uploading
 *
 * Usage: Click the "+" button, select "Simple Image", then paste an image URL
 * The URL must end with an image extension (.jpg, .png, .gif, etc.)
 */
export const simpleImageConfig: ToolConfig = {
  class: SimpleImage,
  inlineToolbar: true,
  config: {
    placeholder: 'Paste an image URL...'
  }
}

/**
 * Alignment tune configuration
 * Block tune that adds text alignment to all blocks
 */
export const alignmentTuneConfig = AlignmentTune

/**
 * Mermaid tool configuration
 * Allows creating diagrams and flowcharts using Mermaid syntax
 */
export const mermaidConfig: ToolConfig = {
  class: MermaidTool,
  inlineToolbar: false,
  config: {
    // Mermaid configuration can be customized here
    // Default theme is neutral
  }
}
