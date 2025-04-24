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

  const [editorContent, setEditorContent] = Retool.useStateString({ name: 'editorContent' })
  const [savedData, setSavedData] = Retool.useStateString({ name: 'savedData' })
  const [backgroundColor, setBackgroundColor] = Retool.useStateString({ name: 'backgroundColor' })
  const [textColor, setTextColor] = Retool.useStateString({ name: 'textColor' })

  useEffect(() => {
    if (!editorRef.current || hasInitialized.current) return

    let parsedData = {}
    if (savedData) {
      try {
        parsedData = JSON.parse(savedData)
      } catch (error) {
        console.error('Error parsing savedData:', error)
      }
    }

    editorInstance.current = new EditorJS({
      holder: editorRef.current,
      placeholder: 'Start typing here...',
      data: parsedData,
      tools: {
        underline: Underline,
        header: {
          class: Header,
          inlineToolbar: ['marker', 'link'],
          shortcut: 'CMD+SHIFT+H',
          levels: [1, 2, 3, 4],
          defaultLevel: 2
        },
        paragraph: {
          class: Paragraph,
          tunes: ['footnotes'],
          inlineToolbar: true,
          plceholder: '',
          preserveBlank: false // Whether or not to keep blank paragraphs when saving editor data
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
            maxRows: 5,
            maxCols: 5,
          },
        },
        list: {
          class: EditorjsList,
          tunes: ['footnotes'],
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
            maxLevel: 3,
            counterTypes: ['numeric']
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author"
          }
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Enter code here...',
          }
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              codepen: {
                regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
                html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                height: 300,
                width: 600,
                id: (groups) => groups.join('/embed/')
              }
            }
          }
        },
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M'
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        delimiter: {
          class: Delimiter,
          shortcut: 'CMD+SHIFT+D'
        },
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/fake-api' // required, but unused
          }
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+W',
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message',
          },
        },
        footnotes: {
          class: Footnotes,
          config:{
            placeholder: 'Footnote text',
            shortcut: 'CMD+SHIFT+F',
          }
        }
      },
      onChange: async () => {
        if (!editorInstance.current) return
        try {
          const data = await editorInstance.current.save()
          const jsonData = JSON.stringify(data)
          setEditorContent(jsonData)
        } catch (error) {
          console.error('Error saving editor data:', error)
        }
      }
    })

    hasInitialized.current = true

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy()
        } catch (err) {
          console.error('Error destroying editor instance', err)
        }
      }
    }
  }, [savedData, setEditorContent])

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
