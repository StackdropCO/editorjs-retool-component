import React, { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import type { FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'

export const EditorComponent: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<EditorJS | null>(null)

  const [name, _setName] = Retool.useStateString({
    name: 'name'
  })

  useEffect(() => {
    if (editorRef.current && !editorInstance.current) {
      // Initialize Editor.js with desired configuration.
      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        placeholder: 'Start typing here...',
        // Example tool configuration – you can add more tools as needed.
        // tools: {
        //   header: {
        //     class: ".ads", // (await import('@editorjs/header')).default,
        //     inlineToolbar: true
        //   }
        // }
      })
    }

    // Cleanup function to destroy the editor instance on unmount.
    return () => {
      if (editorInstance.current) {
        editorInstance.current
          .destroy()
          .catch((error) => console.error('Error destroying editor instance', error))
      }
    }
  }, [])

  return (
    <div>
      <div>Hello {name}!</div>
      <div id="editorjs" ref={editorRef}></div>
    </div>
  )
};