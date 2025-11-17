/**
 * Type declarations for Editor.js modules that lack official TypeScript support
 * This file provides basic type definitions to prevent TypeScript errors
 */

declare module '@editorjs/marker' {
  import { InlineToolConstructable } from '@editorjs/editorjs'
  const Marker: InlineToolConstructable
  export default Marker
}

declare module '@editorjs/link' {
  import { InlineToolConstructable } from '@editorjs/editorjs'
  const LinkTool: InlineToolConstructable
  export default LinkTool
}

declare module '@editorjs/checklist' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Checklist: BlockToolConstructable
  export default Checklist
}

declare module '@editorjs/footnotes' {
  import { InlineToolConstructable } from '@editorjs/editorjs'
  const Footnotes: InlineToolConstructable
  export default Footnotes
}

declare module '@editorjs/image' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const ImageTool: BlockToolConstructable
  export default ImageTool
}

declare module '@codexteam/shortcuts' {
  export default class Shortcuts {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(config: any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    add(shortcut: any): void
    remove(name: string): void
  }
}

declare module '*.pcss' {
  const styles: Record<string, string>
  export default styles
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module 'editorjs-undo' {
  export default class Undo {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(config: { editor: any; maxLength?: number })
    initialize(): void
    destroy(): void
  }
}

declare module 'editorjs-drag-drop' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default function DragDrop(editor: any): void
}

declare module 'editorjs-text-alignment-blocktune' {
  import { BlockTune } from '@editorjs/editorjs'
  const AlignmentTune: BlockTune
  export default AlignmentTune
}

declare module '@editorjs/nested-list' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const NestedList: BlockToolConstructable
  export default NestedList
}

declare module '@editorjs/simple-image' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const SimpleImage: BlockToolConstructable
  export default SimpleImage
}

declare module 'editorjs-mermaid' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const MermaidTool: BlockToolConstructable
  export default MermaidTool
}

declare module '../utils/SimpleLinkTool' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  export class SimpleLinkTool implements BlockToolConstructable {
    constructor(config: any)
    static get toolbox(): any
    render(): HTMLElement
    save(): any
  }
}
