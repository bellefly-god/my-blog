-- Sample Data for Inkwell Blog
-- Run this in Supabase SQL Editor after creating the tables

-- Insert sample tools
INSERT INTO tools (name, slug, description, manual, icon, url) VALUES
(
  'Color Palette Generator',
  'color-palette-generator',
  'Generate beautiful color palettes for your designs. Perfect for designers and developers who need quick color inspiration.',
  '## How to Use

1. **Select Base Color**: Choose a starting color using the color picker
2. **Generate Palette**: Click the "Generate" button to create a harmonious palette
3. **Adjust Colors**: Fine-tune individual colors by clicking on them
4. **Export**: Copy colors in HEX, RGB, or HSL format

## Tips
- Use complementary colors for high contrast
- Analogous colors create a calm, cohesive look
- Triadic palettes offer vibrant contrast',
  '🎨',
  'https://coolors.co'
),
(
  'Markdown Editor',
  'markdown-editor',
  'A powerful markdown editor with live preview, syntax highlighting, and export capabilities.',
  '## Features

- **Live Preview**: See your rendered markdown in real-time
- **Syntax Highlighting**: Code blocks are beautifully formatted
- **Export Options**: Save as HTML, PDF, or plain text
- **Dark Mode**: Easy on the eyes for late-night writing

## Keyboard Shortcuts
- `Ctrl/Cmd + B`: Bold text
- `Ctrl/Cmd + I`: Italic text
- `Ctrl/Cmd + K`: Insert link
- `Ctrl/Cmd + S`: Save document',
  '📝',
  'https://stackedit.io'
),
(
  'JSON Formatter',
  'json-formatter',
  'Format, validate, and beautify your JSON data with ease. Perfect for API debugging and data visualization.',
  '## How to Use

1. **Paste JSON**: Copy your JSON data into the input field
2. **Format**: Click "Format" to beautify the JSON
3. **Validate**: Errors are highlighted with line numbers
4. **Minify**: Compress JSON for production use

## Features
- Syntax highlighting
- Error detection with line numbers
- Tree view for nested structures
- Copy formatted output',
  '📋',
  'https://jsonformatter.org'
),
(
  'Regex Tester',
  'regex-tester',
  'Test and debug regular expressions with real-time matching and explanation.',
  '## Getting Started

1. **Enter Pattern**: Type your regex pattern in the input field
2. **Add Test String**: Enter the text you want to match
3. **See Matches**: Matches are highlighted in real-time

## Common Patterns
- Email: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
- Phone: `\d{3}-\d{3}-\d{4}`
- URL: `https?://[^\s]+`

## Flags
- `g`: Global match
- `i`: Case insensitive
- `m`: Multiline',
  '🔍',
  'https://regex101.com'
),
(
  'Image Optimizer',
  'image-optimizer',
  'Compress and optimize images for web without losing quality. Supports PNG, JPG, WebP, and more.',
  '## Supported Formats
- PNG
- JPEG/JPG
- WebP
- GIF
- SVG

## How to Use
1. **Upload**: Drag and drop or select images
2. **Configure**: Set quality and output format
3. **Download**: Get optimized images

## Tips
- Use WebP for best compression
- 80% quality is usually sufficient for web
- Consider lazy loading for large images',
  '🖼️',
  'https://squoosh.app'
);

-- Insert sample posts (optional - for testing reactions)
-- Note: Your MDX posts will be automatically created when reactions are submitted
-- But you can also manually insert posts here:

-- INSERT INTO posts (title, slug, excerpt, content, date) VALUES
-- ('Sample Post from Database', 'sample-db-post', 'This is a sample post stored in Supabase', 'Full content here...', '2024-03-14');
