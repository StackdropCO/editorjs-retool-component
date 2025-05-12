## Editor.js Retool Component with Supabase Image Upload

A powerful rich text editor custom component for Retool built on Editor.js, featuring modern WYSIWYG block-style editing, clean JSON output, dynamic tool configuration, and built-in Supabase image upload & management.

## Preview

![darkmode preview](https://github.com/user-attachments/assets/acc66815-2008-467d-b4cb-a667521c7597)
![lightmode preview](https://github.com/user-attachments/assets/2050f0b4-84b5-4287-84ac-06126cf428ad)

## Features

* **Block-Style Editing**
  Create structured content with paragraphs, headers, quotes, code blocks, tables, embeds, and more.
* **Clean JSON Output**
  Editor content is stored and emitted as structured JSON.
* **Customizable Styling**
  Control the editor’s background and text colors via Retool properties.
* **Dynamic Tool Configuration**
  Enable or disable any formatting tool on the fly from Retool’s inspector.
* **Rich Formatting Tools**

  * Headers (H1–H4)
  * Lists (ordered & unordered)
  * Quotes
  * Code blocks & inline code
  * Markers (highlights) & underline
  * Delimiters
  * Embeds (YouTube, CodePen)
  * Tables
  * Warnings
  * Links
  * **Image Upload**: drag-and-drop or select images, automatically uploaded to Supabase, with automatic cleanup of deleted images.
* **Supabase Integration**
  Uploads images to your Supabase storage bucket under `articles/{articleId}/content/`, tracks new uploads, and deletes removed files.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/StackdropCO/editorjs-retool-component.git
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Log in to Retool:

   ```bash
   npx retool-ccl login
   ```

   > You’ll need an API access token with read & write scopes for Custom Component Libraries.
4. Initialize your component library:

   ```bash
   npx retool-ccl init
   ```
5. Start development mode:

   ```bash
   npx retool-ccl dev
   ```
6. Deploy your component:

   ```bash
   npx retool-ccl deploy
   ```
7. In your Retool app’s Custom Component settings, switch your component from `dev` to the new version. Refresh to load it.

## Configuration

The component exposes the following Retool properties:

| Property          | Type   | Description                                                               |
| ----------------- | ------ | ------------------------------------------------------------------------- |
| `content`         | String | The current editor content as a JSON string                               |
| `backgroundColor` | String | Editor background color (defaults to `#f8fafc`)                           |
| `textColor`       | String | Editor text color (defaults to `#000`)                                    |
| `supabaseUrl`     | String | Your Supabase project URL                                                 |
| `supabaseKey`     | String | Your Supabase public anon or service role key                             |
| `supabaseBucket`  | String | Name of the Supabase storage bucket                                       |
| `articleId`       | String | Identifier used to namespace images under `articles/{articleId}/content/` |

Internally, the component also maintains a `newImagePaths` array (read-only) for uploaded files.

### Tool Configuration

Enable or disable each tool in the inspector panel:

| Tool Property      | Type    | Description                                |
| ------------------ | ------- | ------------------------------------------ |
| `enableHeader`     | Boolean | Enable header blocks (H1–H4)               |
| `enableList`       | Boolean | Enable ordered/unordered lists             |
| `enableQuote`      | Boolean | Enable quote blocks                        |
| `enableCode`       | Boolean | Enable fenced code blocks                  |
| `enableInlineCode` | Boolean | Enable inline code formatting              |
| `enableMarker`     | Boolean | Enable text highlight (marker)             |
| `enableDelimiter`  | Boolean | Enable delimiter blocks                    |
| `enableEmbed`      | Boolean | Enable embedded content (YouTube, CodePen) |
| `enableTable`      | Boolean | Enable table blocks                        |
| `enableWarning`    | Boolean | Enable warning/info blocks                 |
| `enableLink`       | Boolean | Enable hyperlink tool                      |
| `enableUnderline`  | Boolean | Enable underline formatting                |
| `enableImage`      | Boolean | **Enable image upload via Supabase**       |

## Usage Example

1. **Add the component** to your Retool canvas.
2. **Bind Supabase settings**: supply your `supabaseUrl`, `supabaseKey`, `supabaseBucket`, and a unique `articleId`.
3. **Initialize content**: set the `content` property to existing JSON if loading.
4. **Toggle tools**: check the boxes for the formatting options you need.
5. **Interact**: type, format, embed, and upload images.

   * Images are uploaded to Supabase as soon as they’re added.
   * Removing an image from the editor triggers automatic deletion from your bucket.

You can then use the `content` JSON in your database queries, and Supabase will store only the images currently present in that JSON.

## Data Structure

Editor.js outputs a JSON structure like:

```json
{
  "time": 1635603431943,
  "blocks": [
    {
      "id": "abc123",
      "type": "header",
      "data": { "text": "Hello World", "level": 2 }
    },
    {
      "id": "def456",
      "type": "image",
      "data": {
        "file": {
          "url": "https://xyz.supabase.co/storage/v1/object/public/…jpg",
          "path": "articles/42/content/my-image.jpg"
        }
      }
    },
    {
      "id": "ghi789",
      "type": "paragraph",
      "data": { "text": "This is a paragraph with **formatting**." }
    }
  ],
  "version": "2.28.0"
}
```

* **Image blocks** include a `path` that’s used for cleanup when blocks are removed.

## Development

### Prerequisites

* Node.js ≥ 20.0.0
* Retool developer account

### Local Development

1. Run `npm install`
2. Edit code in `src/`
3. Launch with `npx retool-ccl dev`
4. Test changes in Retool, then `npx retool-ccl deploy` when ready.

## Contributing

Pull requests welcome! Please fork, branch, and open a PR.

## License

MIT License — see [LICENSE](LICENSE) for details.

## About

Created by [Stackdrop](https://stackdrop.co)
