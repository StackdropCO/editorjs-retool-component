# Editor.js Retool Component

A powerful rich text editor custom component for Retool built with Editor.js, providing a modern WYSIWYG editing experience with clean JSON output.

## Features

- **Block-Style Editing**: Create structured content with various block types
- **Clean JSON Output**: All content is stored as structured JSON data
- **Customizable Styling**: Change background and text colors
- **Rich Formatting Tools**:
  - Headers (H1-H4)
  - Lists (ordered and unordered)
  - Quotes
  - Code blocks
  - Checklists
  - Tables
  - Embeds (YouTube, CodePen)
  - Inline formatting (marker, underline, inline code)
  - Delimiters
  - Warnings
  - Footnotes
  - Links

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

   > Note: You'll need an API access token with read and write scopes for Custom Component Libraries.

4. Create a component library:

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

7. Switch component versions:
   > To pin your app to the component version you just published, navigate to the Custom Component settings in your Retool app and change dev to the latest version. This may require you to refresh the page to see the newly published version.

## Configuration

The component exposes the following properties in Retool:

| Property          | Type   | Description                                            |
| ----------------- | ------ | ------------------------------------------------------ |
| `editorContent`   | String | The current editor content as JSON string              |
| `savedData`       | String | Initialize the editor with saved content (JSON string) |
| `backgroundColor` | String | Background color of the editor (defaults to #f8fafc)   |
| `textColor`       | String | Text color in the editor (defaults to #000)            |

## Usage Example

### Basic Setup

1. Drag the Editor.js component onto your Retool canvas
2. Configure the component settings:
   - Set `backgroundColor` and `textColor` if desired
   - Connect `savedData` to load existing content

### Saving Content

1. Create a button with an event handler
2. Access the editor content with `{{components.editorJs.editorContent}}`
3. Use this data in a query to save to your database

### Loading Content

1. Create a query to fetch existing content
2. Set the `savedData` property to `{{data.yourQuery.content}}`

## Data Structure

Editor.js outputs structured JSON data. Example output:

```json
{
  "time": 1635603431943,
  "blocks": [
    {
      "id": "12345",
      "type": "header",
      "data": {
        "text": "Editor.js",
        "level": 2
      }
    },
    {
      "id": "67890",
      "type": "paragraph",
      "data": {
        "text": "This is a paragraph block."
      }
    }
  ],
  "version": "2.23.2"
}
```

## Development

### Prerequisites

- Node.js >= 20.0.0
- Retool developer account

### Local Development

1. Run `npm install` to install dependencies
2. Make changes to the component in the `src` directory
3. Test your changes using the development mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About

Created by [Stackdrop](https://stackdrop.co)
