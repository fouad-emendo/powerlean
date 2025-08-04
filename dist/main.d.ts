declare const GridStack: any;
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
declare class GridStackManager {
    private gridStack;
    private selectedCell;
    private currentGridType;
    private gridConfigs;
    constructor();
    private setupGridStackRenderCallback;
    private enableTouchSupport;
    private initializeGrid;
    private generateInitialWidgets;
    private createWidgetContent;
    private setupGridEvents;
    private setupWidgetEvents;
    private setupEventListeners;
    private setupDragFromOutside;
    private changeGridType;
    private resetGrid;
    private saveLayout;
    private loadLayout;
    private selectWidget;
    private clearWidgetSelection;
    private updateSelectedCellDisplay;
    private addLinkToSelectedCell;
    private updateWidgetLink;
    private setupModalEventListeners;
    private openLinkModal;
    private saveLinkFromModal;
    private removeLinkFromModal;
    private createWidgetHeader;
    private toggleFullscreen;
    private setupKeyboardShortcuts;
    private handleWidgetEdit;
    private showWidgetConfiguration;
}
//# sourceMappingURL=main.d.ts.map