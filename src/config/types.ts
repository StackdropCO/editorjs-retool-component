/**
 * Editor.js tool configuration
 * Uses `any` for class type to accommodate Editor.js ecosystem's incomplete TypeScript support
 */
export interface ToolConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  class: any
  inlineToolbar?: boolean | string[]
  shortcut?: string
  config?: Record<string, unknown>
}

/**
 * Complete tools object for Editor.js
 * Uses `any` to accommodate various tool types in the Editor.js ecosystem
 */
export interface EditorTools {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

/**
 * Tool enable states from Retool
 */
export interface ToolEnableStates {
  enableHeader: boolean
  enableList: boolean
  enableQuote: boolean
  enableCode: boolean
  enableInlineCode: boolean
  enableMarker: boolean
  enableDelimiter: boolean
  enableEmbed: boolean
  enableTable: boolean
  enableWarning: boolean
  enableLink: boolean
  enableUnderline: boolean
  enableChecklist: boolean
  enableImage: boolean
  enableNestedList: boolean
  enableSimpleImage: boolean
  enableMermaid: boolean
}

/**
 * Plugin enable states from Retool
 */
export interface PluginEnableStates {
  enableUndo: boolean
  enableDragDrop: boolean
}

/**
 * Editor.js block data structure
 */
export interface EditorBlock {
  id?: string
  type: string
  data: Record<string, unknown>
}

/**
 * Editor.js output data format
 */
export interface EditorData {
  time?: number
  blocks: EditorBlock[]
  version?: string
}

/**
 * Editor component styling props
 */
export interface EditorStyling {
  backgroundColor?: string
  textColor?: string
}
