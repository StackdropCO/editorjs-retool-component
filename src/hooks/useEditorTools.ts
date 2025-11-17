import { useMemo } from 'react'
import type { EditorTools, ToolEnableStates } from '../config/types'
import {
  paragraphConfig,
  headerConfig,
  listConfig,
  quoteConfig,
  codeConfig,
  inlineCodeConfig,
  markerConfig,
  delimiterConfig,
  embedConfig,
  tableConfig,
  warningConfig,
  linkConfig,
  underlineConfig,
  checklistConfig,
  nestedListConfig,
  simpleImageConfig,
  alignmentTuneConfig,
  mermaidConfig,
  createLinkConfig
} from '../config/toolConfigs'

// Re-export createLinkConfig for use in EditorComponent
export { createLinkConfig }

/**
 * Custom hook to dynamically build Editor.js tools object
 * based on which tools are enabled in Retool
 */
export function useEditorTools(enableStates: ToolEnableStates): EditorTools {
  return useMemo(() => {
    const tools: EditorTools = {
      // Paragraph is always enabled as the default tool with alignment tune
      paragraph: {
        ...paragraphConfig,
        tunes: ['alignmentTune']
      }
    }

    // Add alignment tune as a block tune (applied to all blocks)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools.alignmentTune = alignmentTuneConfig as any

    // Conditionally add tools based on enable states
    if (enableStates.enableHeader) {
      tools.header = {
        ...headerConfig,
        tunes: ['alignmentTune']
      }
    }

    // Use nested list if enabled, otherwise use basic list
    if (enableStates.enableNestedList) {
      tools.list = {
        ...nestedListConfig,
        tunes: ['alignmentTune']
      }
    } else if (enableStates.enableList) {
      tools.list = {
        ...listConfig,
        tunes: ['alignmentTune']
      }
    }

    if (enableStates.enableQuote) {
      tools.quote = {
        ...quoteConfig,
        tunes: ['alignmentTune']
      }
    }

    if (enableStates.enableCode) {
      tools.code = codeConfig
    }

    if (enableStates.enableInlineCode) {
      tools.inlineCode = inlineCodeConfig
    }

    if (enableStates.enableMarker) {
      tools.marker = markerConfig
    }

    if (enableStates.enableDelimiter) {
      tools.delimiter = delimiterConfig
    }

    if (enableStates.enableEmbed) {
      tools.embed = embedConfig
    }

    if (enableStates.enableTable) {
      tools.table = tableConfig
    }

    if (enableStates.enableWarning) {
      tools.warning = warningConfig
    }

    // Note: Link tool is added in EditorComponent with optional endpoint
    // Kept here for backward compatibility if enableLink is false
    if (enableStates.enableLink) {
      tools.linkTool = linkConfig
    }

    if (enableStates.enableUnderline) {
      tools.underline = underlineConfig
    }

    if (enableStates.enableChecklist) {
      tools.checklist = checklistConfig
    }

    if (enableStates.enableSimpleImage) {
      tools.simpleImage = simpleImageConfig
    }

    if (enableStates.enableMermaid) {
      tools.mermaid = mermaidConfig
    }

    return tools
  }, [
    enableStates.enableHeader,
    enableStates.enableList,
    enableStates.enableQuote,
    enableStates.enableCode,
    enableStates.enableInlineCode,
    enableStates.enableMarker,
    enableStates.enableDelimiter,
    enableStates.enableEmbed,
    enableStates.enableTable,
    enableStates.enableWarning,
    enableStates.enableLink,
    enableStates.enableUnderline,
    enableStates.enableChecklist,
    enableStates.enableNestedList,
    enableStates.enableSimpleImage,
    enableStates.enableMermaid
  ])
}
