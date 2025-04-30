# Editor.js Retool Component

A powerful rich text editor custom component for Retool built with Editor.js, providing a modern WYSIWYG editing experience with clean JSON output.

## Features

- **Block-Style Editing**: Create structured content with various block types
- **Clean JSON Output**: All content is stored as structured JSON data
- **Customizable Styling**: Change background and text colors
- **Dynamic Tool Configuration**: Enable/disable specific formatting tools as needed
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

| Property          | Type   | Description                                          |
| ----------------- | ------ | ---------------------------------------------------- |
| `content`         | String | The current editor content as JSON string            |
| `backgroundColor` | String | Background color of the editor (defaults to #f8fafc) |
| `textColor`       | String | Text color in the editor (defaults to #000)          |

### Tool Configuration

Each formatting tool can be enabled or disabled independently through Retool's inspector panel:

| Tool Property      | Type    | Description                                |
| ------------------ | ------- | ------------------------------------------ |
| `enableHeader`     | Boolean | Enable/disable header formatting           |
| `enableList`       | Boolean | Enable/disable list formatting             |
| `enableQuote`      | Boolean | Enable/disable quote blocks                |
| `enableChecklist`  | Boolean | Enable/disable checklist blocks            |
| `enableCode`       | Boolean | Enable/disable code blocks                 |
| `enableInlineCode` | Boolean | Enable/disable inline code formatting      |
| `enableMarker`     | Boolean | Enable/disable marker/highlight formatting |
| `enableDelimiter`  | Boolean | Enable/disable delimiter blocks            |
| `enableEmbed`      | Boolean | Enable/disable embed blocks                |
| `enableTable`      | Boolean | Enable/disable table blocks                |
| `enableWarning`    | Boolean | Enable/disable warning blocks              |
| `enableLink`       | Boolean | Enable/disable link tool                   |
| `enableUnderline`  | Boolean | Enable/disable underline formatting        |
| `enableFootnotes`  | Boolean | Enable/disable footnotes                   |

## Usage Example

### Basic Setup

1. Drag the Editor.js component onto your Retool canvas
2. Configure the component settings:
   - Set `backgroundColor` and `textColor` if desired
   - Connect `content` to load existing content
   - Enable/disable specific formatting tools as needed

### Saving and Loading Content

1. The `content` property serves as both input and output:
   - To load content: Set the `content` property to your existing JSON data
   - To save content: The component will automatically update the `content` property as the user types
2. You can use the `content` value in queries to save to your database

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
