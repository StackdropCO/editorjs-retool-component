/**
 * Simple Link Tool that calls LinkPreview API directly
 * Built from scratch instead of extending @editorjs/link
 */
export class SimpleLinkTool {
  private api: any
  private readOnly: boolean
  private data: any
  private apiKey: string
  private wrapper: HTMLElement | null = null
  private isLoading = false

  static get toolbox() {
    return {
      title: 'Link',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M7.8 3.7c.5-.5 1.2-.5 1.7 0l3.2 3.3c.5.4.5 1.2 0 1.7l-3.2 3.2c-.5.5-1.2.5-1.7 0-.5-.4-.5-1.2 0-1.7l2.4-2.4-2.4-2.4c-.5-.5-.5-1.3 0-1.7zm-6 6c-.5.5-.5 1.2 0 1.7l3.2 3.2c.5.5 1.2.5 1.7 0 .5-.4.5-1.2 0-1.7L4.3 10.5l2.4-2.4c.5-.5.5-1.2 0-1.7-.5-.5-1.2-.5-1.7 0L1.8 9.7z"/></svg>'
    }
  }

  constructor({ data, config, api, readOnly }: any) {
    this.api = api
    this.readOnly = readOnly
    this.data = data || {}
    this.apiKey = config?.apiKey || ''
  }

  render() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('simple-link-tool')

    // If we have data, show the preview
    if (this.data.meta && this.data.meta.title) {
      this.showLinkPreview()
    } else {
      this.showInput()
    }

    return this.wrapper
  }

  showInput() {
    if (!this.wrapper) return

    this.wrapper.innerHTML = `
      <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 4px; background: white;">
        <input
          type="text"
          placeholder="Paste a link..."
          style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
        />
      </div>
    `

    const input = this.wrapper.querySelector('input')
    if (input) {
      input.focus()
      input.addEventListener('paste', (e: any) => {
        setTimeout(() => {
          const url = input.value.trim()
          if (url) {
            this.fetchLinkData(url)
          }
        }, 100)
      })

      input.addEventListener('keydown', (e: any) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          const url = input.value.trim()
          if (url) {
            this.fetchLinkData(url)
          }
        }
      })
    }
  }

  async fetchLinkData(url: string) {
    if (!this.apiKey || !this.apiKey.trim()) {
      // No API key - show manual entry
      this.showManualEntry(url)
      return
    }

    this.showLoading()

    try {
      const response = await fetch(
        `https://api.linkpreview.net?q=${encodeURIComponent(url)}`,
        {
          method: 'GET',
          headers: {
            'X-Linkpreview-Api-Key': this.apiKey.trim()
          }
        }
      )

      if (!response.ok) {
        console.error('LinkPreview API error:', response.status)
        this.showManualEntry(url)
        return
      }

      const data = await response.json()

      if (data.error) {
        console.error('LinkPreview API error:', data.error)
        this.showManualEntry(url)
        return
      }

      // Save the data
      this.data = {
        link: url,
        meta: {
          title: data.title || '',
          description: data.description || '',
          image: {
            url: data.image || ''
          }
        }
      }

      this.showLinkPreview()
    } catch (error) {
      console.error('Error fetching link data:', error)
      this.showManualEntry(url)
    }
  }

  showLoading() {
    if (!this.wrapper) return

    this.wrapper.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #6b7280;">
        Loading...
      </div>
    `
  }

  showManualEntry(url: string) {
    if (!this.wrapper) return

    this.wrapper.innerHTML = `
      <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 4px; background: white;">
        <div style="margin-bottom: 8px;">
          <strong style="font-size: 12px; color: #6b7280;">URL:</strong>
          <div style="font-size: 14px; color: #1f2937;">${url}</div>
        </div>
        <input
          type="text"
          placeholder="Enter title..."
          style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; margin-bottom: 8px;"
          class="link-title-input"
        />
        <textarea
          placeholder="Enter description..."
          style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; resize: vertical; min-height: 60px;"
          class="link-description-input"
        ></textarea>
      </div>
    `

    const titleInput = this.wrapper.querySelector('.link-title-input') as HTMLInputElement
    const descInput = this.wrapper.querySelector('.link-description-input') as HTMLTextAreaElement

    if (titleInput) titleInput.focus()

    const saveData = () => {
      this.data = {
        link: url,
        meta: {
          title: titleInput?.value || '',
          description: descInput?.value || '',
          image: { url: '' }
        }
      }
      this.showLinkPreview()
    }

    titleInput?.addEventListener('blur', saveData)
    descInput?.addEventListener('blur', saveData)
  }

  showLinkPreview() {
    if (!this.wrapper || !this.data.meta) return

    const { link, meta } = this.data
    const hasImage = meta.image?.url

    this.wrapper.innerHTML = `
      <a
        href="${link}"
        target="_blank"
        rel="noopener noreferrer"
        style="
          display: block;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          text-decoration: none;
          color: inherit;
          background: white;
          transition: all 0.2s;
        "
        onmouseover="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'"
        onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
      >
        <div style="display: flex; gap: 12px;">
          ${hasImage ? `
            <img
              src="${meta.image.url}"
              alt="${meta.title}"
              style="
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
                flex-shrink: 0;
              "
              onerror="this.style.display='none'"
            />
          ` : ''}
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 4px;
              color: #1f2937;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">${meta.title}</div>
            ${meta.description ? `
              <div style="
                font-size: 14px;
                color: #6b7280;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              ">${meta.description}</div>
            ` : ''}
            <div style="
              font-size: 12px;
              color: #9ca3af;
              margin-top: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">${link}</div>
          </div>
        </div>
      </a>
    `
  }

  save() {
    return this.data
  }

  static get pasteConfig() {
    return {
      tags: ['A']
      // Don't use patterns here - we'll handle it in onPaste to avoid conflicts with SimpleImage
    }
  }

  /**
   * Check if URL is an image URL
   */
  private isImageUrl(url: string): boolean {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i
    return imageExtensions.test(url)
  }

  onPaste(event: any) {
    const { data } = event.detail

    // If it's an image URL, let SimpleImage handle it
    if (data.url && this.isImageUrl(data.url)) {
      return
    }

    if (data.url) {
      this.fetchLinkData(data.url)
    }
  }
}
