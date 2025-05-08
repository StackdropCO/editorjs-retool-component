import './style.css'

import React, { useEffect, useMemo, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import EditorjsList from '@editorjs/list' // https://github.com/editor-js/list
import Quote from '@editorjs/quote'
import Code from '@editorjs/code' // https://github.com/editor-js/code
import InlineCode from '@editorjs/inline-code' // https://github.com/editor-js/inline-code
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter' // https://github.com/editor-js/delimiter
import Embed from '@editorjs/embed' // https://github.com/editor-js/embed
import Table from '@editorjs/table' // https://github.com/editor-js/table
import Warning from '@editorjs/warning'
import LinkTool from '@editorjs/link'
import ImageTool from '@editorjs/image'
import Underline from '@editorjs/underline'
import Paragraph from '@editorjs/paragraph'
import { createClient } from '@supabase/supabase-js'

import type { FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

export const EditorComponent: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<EditorJS | null>(null)
  const prevImagesRef = useRef<string[]>([])

  // Content and styling states
  const [content, setContent] = Retool.useStateString({
    name: 'content',
    label: 'Editor content',
    description: 'This is the value of the editor'
  })

  // Supabase configuration states
  const [supabaseBucket, setSupabaseBucket] = Retool.useStateString({
    name: 'supabaseBucket',
    label: 'Supabase Bucket',
    description: 'The name of the Supabase bucket to store images'
  })

  const [supabaseUrl, setSupabaseUrl] = Retool.useStateString({
    name: 'supabaseUrl',
    label: 'Supabase URL',
    description: 'The URL of the Supabase instance'
  })
  const [supabaseKey, setSupabaseKey] = Retool.useStateString({
    name: 'supabaseKey',
    label: 'Supabase Key',
    description: 'The key of the Supabase instance'
  })
  const [articleId, setArticleId] = Retool.useStateString({
    name: 'articleId',
    label: 'Article ID',
    description: 'The ID of the article to store images'
  })

  const [newImagePaths, setNewImagePaths] = Retool.useStateArray({
    inspector: 'text',
    name: 'newImagePaths',
    initialValue: []
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
  const [enableImage, _setEnableImage] = Retool.useStateBoolean({
    name: 'enableImage',
    initialValue: false,
    description: 'Enables Image Upload',
    label: 'Image',
    inspector: 'checkbox'
  })

  useEffect(() => {
    setNewImagePaths([])
    prevImagesRef.current = []
  }, [])

  const supabase = useMemo(
    () => createClient(supabaseUrl, supabaseKey),
    [supabaseUrl, supabaseKey]
  )

  const deleteImage = async (filePath: string) => {
    // 1) delete from Supabase
    const { error } = await supabase.storage
      .from(supabaseBucket)
      .remove([filePath])

    if (error) {
      console.error('Failed to delete', filePath, error)
      return
    }

    // 2) remove it from your Retool state array
    setNewImagePaths(
      // note: use the current value, filter out the one you just deleted
      newImagePaths.filter((path) => path !== filePath)
    )
  }

  // Effect for editor initialization and tool configuration
  useEffect(() => {
    if (!editorRef.current) return

    // Build tools object dynamically based on enabled states
    const tools: any = {
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        placeholder: '',
        preserveBlank: true
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

    if (enableImage) {
      tools.image = {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile: async (file: File) => {
              try {
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')

                // Generate a unique filename
                const fileName = `articles/${articleId}/content/${safeName}`

                // Upload to Supabase
                const { data, error } = await supabase.storage
                  .from(supabaseBucket)
                  .upload(fileName, file)

                if (error) {
                  console.error('Error uploading image:', error)
                  throw error
                }

                setNewImagePaths([...newImagePaths, fileName])

                // Get the public URL
                const {
                  data: { publicUrl }
                } = supabase.storage.from(supabaseBucket).getPublicUrl(fileName)

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
                  error: {
                    message: 'Failed to upload image'
                  }
                }
              }
            }
          }
        }
      }
    }

    // Only initialize if not already initialized
    let parsedData = { blocks: [] }
    if (content) {
      try {
        parsedData = JSON.parse(content)
      } catch (error) {
        console.error('Error parsing content:', error)
      }
    }

    const initialPaths = parsedData.blocks
      .filter((b: any) => b.type === 'image')
      .map((b: any) => b.data.file.path as string)
    prevImagesRef.current = initialPaths

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

          // extract all image URLs from the new content
          const newPaths = data.blocks
            .filter((b: any) => b.type === 'image')
            .map((b: any) => b.data.file.path as string)

          // compare to the previous URLs
          const deleted = prevImagesRef.current.filter(
            (p) => !newPaths.includes(p)
          )

          // delete any that went away
          await Promise.all(deleted.map((p) => deleteImage(p)))

          prevImagesRef.current = newPaths

          // update Retool state
          if (jsonData !== content) {
            setContent(jsonData)
          }
        } catch (err) {
          console.error('Error in onChange:', err)
        }
      }
    })
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
    enableImage,
    supabaseBucket
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
