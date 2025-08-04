# PowerLean Interactive Grid Layout

A modern, responsive grid layout application built with **TypeScript** and **[Gridstack.js](https://gridstackjs.com/)** that allows users to create and manage interactive dashboards with draggable, resizable widgets.

## Features

✅ **Multiple Grid Layouts**: Switch between 3x3, 4x4, and 3x4 grid configurations  
✅ **Drag & Drop**: Intuitive drag-and-drop interface for repositioning widgets  
✅ **Resizable Widgets**: Resize widgets by dragging corners and edges  
✅ **Link Management**: Add clickable links to any widget  
✅ **Save/Load Layouts**: Persist your layouts to localStorage  
✅ **Widget Palette**: Drag new widgets from the sidebar  
✅ **Responsive Design**: Works on desktop, tablet, and mobile devices  
✅ **TypeScript**: Full TypeScript support for better development experience  

## Why Gridstack.js?

Based on the [Gridstack.js website](https://gridstackjs.com/), this library is perfect for this use case because:

- **Pure TypeScript**: No external dependencies, modern codebase
- **Framework Agnostic**: Works with any framework or vanilla JS
- **Advanced Features**: Built-in drag-and-drop, resizing, responsive layouts
- **Mobile Support**: Touch-friendly interface
- **Battle-tested**: Used by VMware, Node-RED, and many other companies
- **Active Development**: Current version v10.3.1 with regular updates

## Installation

### Option 1: Using npm (Recommended)

1. **Install dependencies:**
```bash
npm install
```

2. **Build the TypeScript:**
```bash
npm run build
```

3. **Serve the application:**
```bash
npm run serve
```

4. **Open your browser** and navigate to `http://localhost:8080`

### Option 2: CDN (Quick Start)

If you prefer to use CDN instead of npm, update the HTML file:

```html
<!-- Replace the gridstack import in index.html with: -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@10.3.1/dist/gridstack.min.css">
<script src="https://cdn.jsdelivr.net/npm/gridstack@10.3.1/dist/gridstack-all.js"></script>
```

## Project Structure

```
powerlean/
├── index.html          # Main HTML file
├── styles.css          # Application styles
├── src/
│   └── main.ts        # TypeScript source code
├── dist/              # Compiled JavaScript (generated)
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## Usage

### Basic Operations

1. **Select Grid Layout**: Use the dropdown to choose between 3x3, 4x4, or 3x4 grids
2. **Select Widget**: Click on any widget to select it (highlighted in blue)
3. **Drag to Reposition**: Drag widgets to new positions
4. **Resize Widgets**: Drag the edges or corners to resize
5. **Add Links**: 
   - Select a widget, then use the sidebar form to add a link
   - Or double-click a widget to open the edit modal

### Advanced Features

- **Save Layout**: Click "Save Layout" to persist your current configuration
- **Load Layout**: Click "Load Layout" to restore a saved configuration
- **Reset Grid**: Click "Reset Grid" to restore default layout
- **Drag New Widgets**: Drag items from the widget palette to add new widgets
- **Remove Widgets**: Drag widgets outside the grid area (if trash zone is configured)

### Adding Custom Widget Types

To add new widget types to the palette, modify the `widget-palette` section in `index.html`:

```html
<div class="palette-item" draggable="true" data-gs-width="2" data-gs-height="2">
    <span>📈 New Chart Type</span>
</div>
```

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development (recompiles on changes)
- `npm run serve` - Serve the application locally

### TypeScript Development

The application is fully typed with TypeScript. Key interfaces:

```typescript
interface GridCell {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    link?: {
        url: string;
        title: string;
    };
}

type GridType = '3x3' | '4x4' | '3x4';
```

### Customization

#### Grid Configurations

Modify the `gridConfigs` object in `src/main.ts`:

```typescript
private gridConfigs = {
    '3x3': { columns: 3, maxRows: 3 },
    '4x4': { columns: 4, maxRows: 4 },
    '3x4': { columns: 3, maxRows: 4 },
    // Add your custom configurations
    '5x5': { columns: 5, maxRows: 5 }
};
```

#### Styling

The application uses CSS Grid and Flexbox with custom properties. Main style sections:

- **Grid Layout**: `.grid-stack` and related classes
- **Widgets**: `.grid-stack-item-content` and children
- **Sidebar**: `.sidebar` and `.widget-palette`
- **Responsive**: Media queries for mobile devices

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Requirements**: ES2020 support, CSS Grid, Flexbox

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Performance

The application is optimized for performance:
- **Gridstack.js**: Efficient drag-and-drop algorithms
- **TypeScript**: Compiled to optimized JavaScript
- **CSS**: Hardware-accelerated transitions
- **Local Storage**: Minimal data persistence

## Troubleshooting

### Common Issues

1. **Widgets not dragging**: Ensure gridstack CSS is loaded
2. **TypeScript errors**: Run `npm run build` to check for compilation errors
3. **Layout not saving**: Check browser localStorage permissions
4. **Mobile issues**: Ensure viewport meta tag is present

### Debug Mode

Enable console logging by modifying the `setupGridEvents` method:

```typescript
this.gridStack.on('change', (event: any, items: any[]) => {
    console.log('Grid changed:', items); // Already enabled
});
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **[Gridstack.js](https://gridstackjs.com/)** - The powerful grid layout library
- **TypeScript** - For robust type safety
- **Modern CSS** - For responsive, beautiful layouts

---

**Built with ❤️ using [Gridstack.js](https://gridstackjs.com/) and TypeScript**