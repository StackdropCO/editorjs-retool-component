import './style.css'

import React, { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import EditorjsList from '@editorjs/list' // https://github.com/editor-js/list
import Quote from '@editorjs/quote'
import Checklist from '@editorjs/checklist' // https://github.com/editor-js/checklist
import Code from '@editorjs/code' // https://github.com/editor-js/code
import InlineCode from '@editorjs/inline-code' // https://github.com/editor-js/inline-code
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter' // https://github.com/editor-js/delimiter
import Embed from '@editorjs/embed' // https://github.com/editor-js/embed
import Table from '@editorjs/table' // https://github.com/editor-js/table
import Warning from '@editorjs/warning'
import LinkTool from '@editorjs/link'
// import Image from '@editorjs/image'
import Underline from '@editorjs/underline'
import Paragraph from '@editorjs/paragraph'
import Footnotes from '@editorjs/footnotes' // https://github.com/editor-js/footnotes-tune

import type { FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

export const EditorComponent: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<EditorJS | null>(null)
  const hasInitialized = useRef(false)
  const debounceTimeout = useRef<NodeJS.Timeout>()

  // Content and styling states
  const [content, setContent] = Retool.useStateString({
    name: 'content',
    label: 'Editor content',
    description: 'This is the value of the editor'
  })
  const [backgroundColor, setBackgroundColor] = Retool.useStateString({
    name: 'backgroundColor',
    label: 'Background color',
    description: 'Background color of the editor'
  })
  const [textColor, setTextColor] = Retool.useStateString({
    name: 'textColor',
    label: 'Text color',
    description: 'Text color of the editor'
  })

  // Tool states
  const [enableHeader, _setEnableHeader] = Retool.useStateBoolean({
    name: 'enableHeader',
    initialValue: false,
    description: 'Enables Headers',
    label: 'Header',
    inspector: 'checkbox'
  })
  const [enableList, _setEnableList] = Retool.useStateBoolean({
    name: 'enableList',
    initialValue: false,
    description: 'Enables Lists',
    label: 'List',
    inspector: 'checkbox'
  })
  const [enableQuote, _setEnableQuote] = Retool.useStateBoolean({
    name: 'enableQuote',
    initialValue: false,
    description: 'Enables Quotes',
    label: 'Quote',
    inspector: 'checkbox'
  })
  const [enableChecklist, _setEnableChecklist] = Retool.useStateBoolean({
    name: 'enableChecklist',
    initialValue: false,
    description: 'Enables Checklists',
    label: 'Checklist',
    inspector: 'checkbox'
  })
  const [enableCode, _setEnableCode] = Retool.useStateBoolean({
    name: 'enableCode',
    initialValue: false,
    description: 'Enables Code',
    label: 'Code',
    inspector: 'checkbox'
  })
  const [enableInlineCode, _setEnableInlineCode] = Retool.useStateBoolean({
    name: 'enableInlineCode',
    initialValue: false,
    description: 'Enables Inline Code',
    label: 'Inline Code',
    inspector: 'checkbox'
  })
  const [enableMarker, _setEnableMarker] = Retool.useStateBoolean({
    name: 'enableMarker',
    initialValue: false,
    description: 'Enables Marker',
    label: 'Marker',
    inspector: 'checkbox'
  })
  const [enableDelimiter, _setEnableDelimiter] = Retool.useStateBoolean({
    name: 'enableDelimiter',
    initialValue: false,
    description: 'Enables Delimiter',
    label: 'Delimiter',
    inspector: 'checkbox'
  })
  const [enableEmbed, _setEnableEmbed] = Retool.useStateBoolean({
    name: 'enableEmbed',
    initialValue: false,
    description: 'Enables Embed',
    label: 'Embed',
    inspector: 'checkbox'
  })
  const [enableTable, _setEnableTable] = Retool.useStateBoolean({
    name: 'enableTable',
    initialValue: false,
    description: 'Enables Table',
    label: 'Table',
    inspector: 'checkbox'
  })
  const [enableWarning, _setEnableWarning] = Retool.useStateBoolean({
    name: 'enableWarning',
    initialValue: false,
    description: 'Enables Warning',
    label: 'Warning',
    inspector: 'checkbox'
  })
  const [enableLink, _setEnableLink] = Retool.useStateBoolean({
    name: 'enableLink',
    initialValue: false,
    description: 'Enables Link',
    label: 'Link',
    inspector: 'checkbox'
  })
  const [enableUnderline, _setEnableUnderline] = Retool.useStateBoolean({
    name: 'enableUnderline',
    initialValue: false,
    description: 'Enables Underline',
    label: 'Underline',
    inspector: 'checkbox'
  })
  const [enableFootnotes, _setEnableFootnotes] = Retool.useStateBoolean({
    name: 'enableFootnotes',
    initialValue: false,
    description: 'Enables Footnotes',
    label: 'Footnotes',
    inspector: 'checkbox'
  })

  // Effect for editor initialization and tool configuration
  useEffect(() => {
    if (!editorRef.current) return

    // Build tools object dynamically based on enabled states
    const tools: any = {
      paragraph: {
        class: Paragraph,
        tunes: enableFootnotes ? ['footnotes'] : [],
        inlineToolbar: true,
        plceholder: '',
        preserveBlank: false
      }
    }

    if (enableHeader) {
      tools.header = {
        class: Header,
        inlineToolbar: ['marker', 'link'],
        shortcut: 'CMD+SHIFT+H',
        levels: [1, 2, 3, 4],
        defaultLevel: 2
      }
    }

    if (enableList) {
      tools.list = {
        class: EditorjsList,
        tunes: enableFootnotes ? ['footnotes'] : [],
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered',
          maxLevel: 3,
          counterTypes: ['numeric']
        }
      }
    }

    if (enableQuote) {
      tools.quote = {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: "Quote's author"
        }
      }
    }

    if (enableChecklist) {
      tools.checklist = {
        class: Checklist,
        inlineToolbar: true
      }
    }

    if (enableCode) {
      tools.code = {
        class: Code,
        config: {
          placeholder: 'Enter code here...'
        }
      }
    }

    if (enableInlineCode) {
      tools.inlineCode = {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+M'
      }
    }

    if (enableMarker) {
      tools.marker = {
        class: Marker,
        shortcut: 'CMD+SHIFT+M'
      }
    }

    if (enableDelimiter) {
      tools.delimiter = {
        class: Delimiter,
        shortcut: 'CMD+SHIFT+D'
      }
    }

    if (enableEmbed) {
      tools.embed = {
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
    }

    if (enableTable) {
      tools.table = {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
          maxRows: 5,
          maxCols: 5
        }
      }
    }

    if (enableWarning) {
      tools.warning = {
        class: Warning,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+W',
        config: {
          titlePlaceholder: 'Title',
          messagePlaceholder: 'Message'
        }
      }
    }

    if (enableLink) {
      tools.linkTool = {
        class: LinkTool,
        config: {
          endpoint: '/fake-api'
        }
      }
    }

    if (enableUnderline) {
      tools.underline = Underline
    }

    if (enableFootnotes) {
      tools.footnotes = {
        class: Footnotes,
        config: {
          placeholder: 'Footnote text',
          shortcut: 'CMD+SHIFT+F'
        }
      }
    }

    // Only initialize if not already initialized
    if (!editorInstance.current) {
      let parsedData = { blocks: [] }
      if (content) {
        try {
          parsedData = JSON.parse(content)
        } catch (error) {
          console.error('Error parsing content:', error)
        }
      }

      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        placeholder: 'Start typing here...',
        data: parsedData,
        tools,
        onChange: async () => {
          if (!editorInstance.current) return
          try {
            const data = await editorInstance.current.save()
            const jsonData = JSON.stringify(data)

            // Clear any existing timeout
            if (debounceTimeout.current) {
              clearTimeout(debounceTimeout.current)
            }

            // Debounce the content update
            debounceTimeout.current = setTimeout(() => {
              // Only update content if it's different to prevent infinite loops
              if (jsonData !== content) {
                setContent(jsonData)
              }
            }, 1000) // 1 second debounce
          } catch (error) {
            console.error('Error saving editor data:', error)
          }
        }
      })
    } else {
      // If editor is already initialized, destroy and recreate with new tools
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
            onChange: async () => {
              if (!editorInstance.current) return
              try {
                const data = await editorInstance.current.save()
                const jsonData = JSON.stringify(data)

                // Clear any existing timeout
                if (debounceTimeout.current) {
                  clearTimeout(debounceTimeout.current)
                }

                // Debounce the content update
                debounceTimeout.current = setTimeout(() => {
                  // Only update content if it's different to prevent infinite loops
                  if (jsonData !== content) {
                    setContent(jsonData)
                  }
                }, 1000) // 1 second debounce
              } catch (error) {
                console.error('Error saving editor data:', error)
              }
            }
          })
        } catch (error) {
          console.error('Error saving editor data:', error)
        }
      }
      saveAndReinitialize()
    }

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy()
          editorInstance.current = null
        } catch (err) {
          console.error('Error destroying editor instance', err)
        }
      }
    }
  }, [
    enableHeader,
    enableList,
    enableQuote,
    enableChecklist,
    enableCode,
    enableInlineCode,
    enableMarker,
    enableDelimiter,
    enableEmbed,
    enableTable,
    enableWarning,
    enableLink,
    enableUnderline,
    enableFootnotes
  ])

  return (
    <div style={{ fontFamily: 'Lexend, sans-serif' }}>
      <div
        id="editorjs"
        ref={editorRef}
        style={{
          padding: '16px',
          height: '100%',
          backgroundColor: backgroundColor || '#f8fafc',
          color: textColor || '#000',
          borderRadius: '8px'
        }}
      ></div>
    </div>
  )
}
