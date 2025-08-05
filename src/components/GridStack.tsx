import React, { useEffect, useRef } from 'react';
import { GridStack as GridStackJS } from 'gridstack';
// CSS will be imported globally through Vite config

interface GridStackProps {
  children?: React.ReactNode;
  className?: string;
}

export function GridStack({ children, className = '' }: GridStackProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstanceRef = useRef<GridStackJS>();

  useEffect(() => {
    if (!gridRef.current) return;

    // Initialize GridStack
    const grid = GridStackJS.init({
      column: 3,
      cellHeight: 180,
      margin: 12,
      minRow: 3,
      maxRow: 13,
      float: false,
      animate: true,
      disableDrag: false,
      disableResize: false,
      resizable: {
        handles: 'se, sw, ne, nw, s, n, e, w',
        autoHide: false
      },
      draggable: {
        handle: '.grid-stack-item-content, .widget-header'
      }
    }, gridRef.current);

    gridInstanceRef.current = grid;

    // Add event listeners
    grid.on('change', (_event: Event, _items: any[]) => {
      console.log('Grid changed:', grid.save());
    });

    grid.on('added', (_event: Event, items: any[]) => {
      console.log('Items added:', items);
    });

    grid.on('removed', (_event: Event, items: any[]) => {
      console.log('Items removed:', items);
    });

    // Cleanup
    return () => {
      if (gridInstanceRef.current) {
        gridInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={`grid-stack ${className}`} ref={gridRef}>
      {children}
    </div>
  );
}

export function GridItem({ children, x, y, width = 1, height = 1, id }: {
  children: React.ReactNode;
  x: number;
  y: number;
  width?: number;
  height?: number;
  id: string;
}) {
  return (
    <div
      className="grid-stack-item"
      data-gs-x={x}
      data-gs-y={y}
      data-gs-width={width}
      data-gs-height={height}
      data-gs-id={id}
    >
      <div className="grid-stack-item-content">
        {children}
      </div>
    </div>
  );
}