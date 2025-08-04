// Import gridstack types (you might need to install @types/gridstack if available)
declare const GridStack: any;

// Types and interfaces
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
    content?: string;
}

type GridType = '3x3' | '4x4' | '3x4';

// Main Grid Manager Class using GridStack.js
class GridStackManager {
    private gridStack: any;
    private selectedCell: GridCell | null = null;
    private currentGridType: GridType = '3x3';
    private gridConfigs = {
        '3x3': { columns: 3, maxRows: 3 },
        '4x4': { columns: 4, maxRows: 4 },
        '3x4': { columns: 3, maxRows: 4 }
    };

    constructor() {
        this.setupGridStackRenderCallback();
        this.initializeGrid();
        this.setupEventListeners();
        this.setupDragFromOutside();
    }

    private setupGridStackRenderCallback(): void {
        // Set up render callback for GridStack v11+ security requirements
        (GridStack as any).renderCB = function(el: HTMLElement, w: any) {
            if (w.content) {
                el.innerHTML = w.content;
            }
        };
    }

    private enableTouchSupport(): void {
        // Add touch event support for better mobile interaction
        const items = document.querySelectorAll('.grid-stack-item');
        items.forEach((item) => {
            const element = item as HTMLElement;
            element.style.touchAction = 'none'; // Prevent default touch behaviors
            
            // Add visual feedback for touch
            element.addEventListener('touchstart', () => {
                element.style.transition = 'transform 0.1s ease';
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
            });
        });
    }

    private initializeGrid(): void {
        const config = this.gridConfigs[this.currentGridType];
        
        this.gridStack = GridStack.init({
            // Grid structure
            column: config.columns,
            maxRow: config.maxRows,
            cellHeight: 70,
            margin: 10,
            
            // Enable dragging and resizing
            staticGrid: true,              // Allow interaction
            disableDrag: false,             // Enable dragging
            disableResize: false,           // Enable resizing
            
            // Resize handles configuration
            alwaysShowResizeHandle: 'mobile', // Show resize handles on mobile
            resizable: {
                handles: 'e, se, s, sw, w'  // Enable resize from multiple directions
            },
            
            // Dragging configuration
            draggable: {
                handle: '.widget-header',    // Use header as drag handle
                scroll: true,                // Allow scrolling while dragging
                appendTo: 'body'            // Append helper to body
            },
            
            // Animation and behavior
            animate: true,                   // Smooth animations
            float: false,                    // Prevent floating behavior
            
            // Widget management
            removable: '.trash-zone',
            acceptWidgets: true,
            dragIn: '.palette-item',
            dragInOptions: {
                revert: 'invalid',
                scroll: false,
                appendTo: 'body',
                helper: function(event: any) {
                    const helper = event.currentTarget.cloneNode(true) as HTMLElement;
                    helper.style.width = '100px';
                    helper.style.height = '70px';
                    helper.style.background = '#667eea';
                    helper.style.color = 'white';
                    helper.style.borderRadius = '4px';
                    helper.style.display = 'flex';
                    helper.style.alignItems = 'center';
                    helper.style.justifyContent = 'center';
                    helper.style.position = 'fixed';
                    helper.style.zIndex = '1000';
                    return helper;
                }
            }
        });

        this.generateInitialWidgets();
        this.setupGridEvents();
        
        // Ensure grid resizes properly after initialization and enable touch
        setTimeout(() => {
            this.gridStack.onResize();
            // Enable touch events for mobile
            this.enableTouchSupport();
        }, 100);
    }

    private generateInitialWidgets(): void {
        const config = this.gridConfigs[this.currentGridType];
        const totalCells = config.columns * config.maxRows;
        
        for (let i = 0; i < totalCells; i++) {
            const x = i % config.columns;
            const y = Math.floor(i / config.columns);
            
            const cellId = `cell-${y}-${x}`;
            
            // Create widget using GridStack's proper format
            const widgetContent = this.createWidgetContent(cellId);
            const widgetConfig = {
                x: x,
                y: y,
                w: 1,
                h: 1,
                content: widgetContent,
                id: cellId
            };
            
            this.gridStack.addWidget(widgetConfig);
        }
    }

    private createWidgetContent(id: string, link?: any): string {
        return `
            <div class="widget-header">
                <span class="widget-id">${id}</span>
                <button class="widget-edit-btn" data-cell-id="${id}">⚙️</button>
            </div>
            <div class="widget-body">
                ${link ? 
                    `<a href="${link.url}" target="_blank" class="widget-link">${link.title}</a>` : 
                    '<span class="empty-widget">Click to add link</span>'
                }
            </div>
        `;
    }

    private setupGridEvents(): void {
        this.gridStack.on('change', (event: any, items: any[]) => {
            console.log('Grid changed:', items);
        });

        this.gridStack.on('added', (event: any, items: any[]) => {
            items.forEach((item: any) => {
                this.setupWidgetEvents(item.el);
            });
        });

        this.gridStack.on('removed', (event: any, items: any[]) => {
            console.log('Widgets removed:', items);
        });
    }

    private setupWidgetEvents(widgetElement: HTMLElement): void {
        // Click to select widget
        widgetElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectWidget(widgetElement);
        });

        // Edit button click
        const editBtn = widgetElement.querySelector('.widget-edit-btn') as HTMLElement;
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cellId = editBtn.dataset.cellId;
                this.openLinkModal(cellId!);
            });
        }

        // Double click to edit
        widgetElement.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const cellId = widgetElement.dataset.gsId;
            if (cellId) {
                this.openLinkModal(cellId);
            }
        });
    }

    private setupEventListeners(): void {
        // Grid selector
        const gridSelector = document.getElementById('grid-selector') as HTMLSelectElement;
        gridSelector.addEventListener('change', (e) => {
            this.changeGridType((e.target as HTMLSelectElement).value as GridType);
        });

        // Reset grid button
        const resetButton = document.getElementById('reset-grid')!;
        resetButton.addEventListener('click', () => {
            this.resetGrid();
        });

        // Save layout button
        const saveButton = document.getElementById('save-layout')!;
        saveButton.addEventListener('click', () => {
            this.saveLayout();
        });

        // Load layout button
        const loadButton = document.getElementById('load-layout')!;
        loadButton.addEventListener('click', () => {
            this.loadLayout();
        });

        // Add link button
        const addLinkButton = document.getElementById('add-link')!;
        addLinkButton.addEventListener('click', () => {
            this.addLinkToSelectedCell();
        });

        // Modal handling
        this.setupModalEventListeners();

        // Click outside to deselect
        document.addEventListener('click', () => {
            this.selectedCell = null;
            this.updateSelectedCellDisplay();
            this.clearWidgetSelection();
        });
    }

    private setupDragFromOutside(): void {
        // Make palette items draggable
        const paletteItems = document.querySelectorAll('.palette-item');
        paletteItems.forEach((item: any) => {
            item.addEventListener('dragstart', (e: DragEvent) => {
                // GridStack will handle the drag from outside
                e.dataTransfer!.setData('text/plain', '');
            });
        });
    }

    private changeGridType(newType: GridType): void {
        const currentLayout = this.gridStack.save();
        
        this.currentGridType = newType;
        const config = this.gridConfigs[newType];
        
        // Destroy current grid
        this.gridStack.destroy(false);
        
        // Initialize new grid with full configuration
        this.gridStack = GridStack.init({
            // Grid structure
            column: config.columns,
            maxRow: config.maxRows,
            cellHeight: 70,
            margin: 10,
            
            // Enable dragging and resizing
            staticGrid: true,
            disableDrag: false,
            disableResize: false,
            
            // Resize handles configuration
            alwaysShowResizeHandle: 'mobile',
            resizable: {
                handles: 'e, se, s, sw, w'
            },
            
            // Dragging configuration
            draggable: {
                handle: '.widget-header',
                scroll: true,
                appendTo: 'body'
            },
            
            // Animation and behavior
            animate: true,
            float: false,
            
            // Widget management
            removable: '.trash-zone',
            acceptWidgets: true,
            dragIn: '.palette-item'
        });

        this.generateInitialWidgets();
        this.setupGridEvents();
        
        // Force grid to recalculate layout
        setTimeout(() => {
            this.gridStack.onResize();
        }, 100);
        
        this.selectedCell = null;
        this.updateSelectedCellDisplay();
    }

    private resetGrid(): void {
        this.gridStack.removeAll();
        this.generateInitialWidgets();
        this.selectedCell = null;
        this.updateSelectedCellDisplay();
    }

    private saveLayout(): void {
        const layout = this.gridStack.save();
        localStorage.setItem(`gridstack-layout-${this.currentGridType}`, JSON.stringify(layout));
        alert('Layout saved successfully!');
    }

    private loadLayout(): void {
        const savedLayout = localStorage.getItem(`gridstack-layout-${this.currentGridType}`);
        if (savedLayout) {
            const layout = JSON.parse(savedLayout);
            this.gridStack.load(layout);
            alert('Layout loaded successfully!');
        } else {
            alert('No saved layout found for this grid type!');
        }
    }

    private selectWidget(widgetElement: HTMLElement): void {
        // Clear previous selection
        this.clearWidgetSelection();
        
        // Add selection styling
        widgetElement.classList.add('selected-widget');
        
        const cellId = widgetElement.dataset.gsId;
        if (cellId) {
            this.selectedCell = {
                id: cellId,
                x: parseInt(widgetElement.dataset.gsX || '0'),
                y: parseInt(widgetElement.dataset.gsY || '0'),
                w: parseInt(widgetElement.dataset.gsWidth || '1'),
                h: parseInt(widgetElement.dataset.gsHeight || '1')
            };
        }
        
        this.updateSelectedCellDisplay();
    }

    private clearWidgetSelection(): void {
        document.querySelectorAll('.selected-widget').forEach(el => {
            el.classList.remove('selected-widget');
        });
    }

    private updateSelectedCellDisplay(): void {
        const selectedCellId = document.getElementById('selected-cell-id')!;
        selectedCellId.textContent = this.selectedCell ? this.selectedCell.id : 'None';
    }

    private addLinkToSelectedCell(): void {
        if (!this.selectedCell) {
            alert('Please select a cell first');
            return;
        }

        const urlInput = document.getElementById('link-url') as HTMLInputElement;
        const titleInput = document.getElementById('link-title') as HTMLInputElement;
        
        const url = urlInput.value.trim();
        const title = titleInput.value.trim();
        
        if (!url) {
            alert('Please enter a URL');
            return;
        }

        this.updateWidgetLink(this.selectedCell.id, {
            url: url.startsWith('http') ? url : `https://${url}`,
            title: title || url
        });

        // Clear inputs
        urlInput.value = '';
        titleInput.value = '';
    }

    private updateWidgetLink(cellId: string, link: {url: string, title: string}): void {
        const widget = document.querySelector(`[data-gs-id="${cellId}"]`) as HTMLElement;
        if (widget) {
            const widgetBody = widget.querySelector('.widget-body')!;
            widgetBody.innerHTML = `<a href="${link.url}" target="_blank" class="widget-link">${link.title}</a>`;
            
            // Update the GridStack widget data
            const gridWidget = this.gridStack.getGridItems().find((item: any) => item.gridstackNode?.id === cellId);
            if (gridWidget) {
                const content = this.createWidgetContent(cellId, link);
                gridWidget.gridstackNode.content = content;
            }
        }
    }

    private setupModalEventListeners(): void {
        const modal = document.getElementById('link-modal')!;
        const closeBtn = modal.querySelector('.close')!;
        const saveBtn = document.getElementById('save-link')!;
        const removeBtn = document.getElementById('remove-link')!;

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        saveBtn.addEventListener('click', () => {
            this.saveLinkFromModal();
        });

        removeBtn.addEventListener('click', () => {
            this.removeLinkFromModal();
        });
    }

    private openLinkModal(cellId: string): void {
        const widget = document.querySelector(`[data-gs-id="${cellId}"]`) as HTMLElement;
        if (!widget) return;

        const linkElement = widget.querySelector('.widget-link') as HTMLAnchorElement;
        
        const modal = document.getElementById('link-modal')!;
        const urlInput = document.getElementById('modal-link-url') as HTMLInputElement;
        const titleInput = document.getElementById('modal-link-title') as HTMLInputElement;
        
        if (linkElement) {
            urlInput.value = linkElement.href;
            titleInput.value = linkElement.textContent || '';
        } else {
            urlInput.value = '';
            titleInput.value = '';
        }
        
        // Store current cell ID for modal actions
        modal.dataset.currentCellId = cellId;
        modal.style.display = 'block';
        urlInput.focus();
    }

    private saveLinkFromModal(): void {
        const modal = document.getElementById('link-modal')!;
        const cellId = modal.dataset.currentCellId;
        if (!cellId) return;

        const urlInput = document.getElementById('modal-link-url') as HTMLInputElement;
        const titleInput = document.getElementById('modal-link-title') as HTMLInputElement;
        
        const url = urlInput.value.trim();
        const title = titleInput.value.trim();
        
        if (url) {
            this.updateWidgetLink(cellId, {
                url: url.startsWith('http') ? url : `https://${url}`,
                title: title || url
            });
        }

        modal.style.display = 'none';
    }

    private removeLinkFromModal(): void {
        const modal = document.getElementById('link-modal')!;
        const cellId = modal.dataset.currentCellId;
        if (!cellId) return;

        const widget = document.querySelector(`[data-gs-id="${cellId}"]`) as HTMLElement;
        if (widget) {
            const widgetBody = widget.querySelector('.widget-body')!;
            widgetBody.innerHTML = '<span class="empty-widget">Click to add link</span>';
            
            // Update the GridStack widget data
            const gridWidget = this.gridStack.getGridItems().find((item: any) => item.gridstackNode?.id === cellId);
            if (gridWidget) {
                const content = this.createWidgetContent(cellId);
                gridWidget.gridstackNode.content = content;
            }
        }

        modal.style.display = 'none';
    }

    private createWidgetHeader(id: string): HTMLElement {
        const header = document.createElement('div');
        header.className = 'widget-header';

        // Widget number
        const number = document.createElement('div');
        number.className = 'widget-number';
        number.textContent = id;

        // Controls container
        const controls = document.createElement('div');
        controls.className = 'widget-controls';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            this.handleWidgetEdit(id);
        };

        // Fullscreen button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.title = 'Toggle fullscreen';
        fullscreenBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
        fullscreenBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleFullscreen(id);
        };

        controls.appendChild(editBtn);
        controls.appendChild(fullscreenBtn);
        header.appendChild(number);
        header.appendChild(controls);

        return header;
    }

    private toggleFullscreen(id: string): void {
        const gridItem = document.querySelector(`.grid-stack-item[gs-id="${id}"]`) as HTMLElement;
        if (!gridItem) return;

        const isFullscreen = gridItem.classList.contains('fullscreen');
        const icon = gridItem.querySelector('.fullscreen-btn i');

        if (isFullscreen) {
            gridItem.classList.remove('fullscreen');
            if (icon) {
                icon.classList.remove('bi-fullscreen-exit');
                icon.classList.add('bi-arrows-fullscreen');
            }
            // Re-enable grid functionality
            this.gridStack.enableMove(true);
            this.gridStack.enableResize(true);
        } else {
            gridItem.classList.add('fullscreen');
            if (icon) {
                icon.classList.remove('bi-arrows-fullscreen');
                icon.classList.add('bi-fullscreen-exit');
            }
            // Disable grid functionality while in fullscreen
            this.gridStack.enableMove(false);
            this.gridStack.enableResize(false);
        }
    }

    // Add escape key handler to exit fullscreen
    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const fullscreenWidget = document.querySelector('.grid-stack-item.fullscreen');
                if (fullscreenWidget) {
                    const id = fullscreenWidget.getAttribute('gs-id');
                    if (id) this.toggleFullscreen(id);
                }
            }
        });
    }

    private handleWidgetEdit(id: string): void {
        // Find the widget in the grid
        const widget = this.gridStack.engine.nodes.find((n: any) => n.id === id);
        if (widget) {
            this.selectedCell = widget;
            this.showWidgetConfiguration();
        }
    }

    private showWidgetConfiguration(): void {
        const noSelection = document.getElementById('no-selection');
        const widgetConfig = document.getElementById('widget-config');
        
        if (noSelection && widgetConfig) {
            noSelection.style.display = 'none';
            widgetConfig.style.display = 'block';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GridStackManager();
});