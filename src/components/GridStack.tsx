import React, { useEffect, useRef } from 'react';
import { GridStack as GridStackJS } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

interface GridStackProps {
  children?: React.ReactNode;
  className?: string;
  onGridReady?: (grid: GridStackJS) => void;
}

export function GridStack({ children, className = '', onGridReady }: GridStackProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = GridStackJS.init({
      column: 3,
      cellHeight: 180,
      margin: 12,
      minRow: 3,
      float: false,
      removable: false,
      disableResize: false,
      draggable: {
        handle: '.widget-header',
      },
      resizable: {
        handles: 'se, sw, s, w, e, n, nw, ne',
      },
    }, gridRef.current);

    if (onGridReady) {
      onGridReady(grid);
    }

    return () => {
      grid.destroy(false);
    };
  }, [onGridReady]);

  return (
    <div className={`grid-stack ${className}`} ref={gridRef}>
      {children}
    </div>
  );
}

export function GridItem({ children, id, x, y, width = 1, height = 1 }: {
  children: React.ReactNode;
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className="grid-stack-item"
      data-gs-id={id}
      data-gs-x={x}
      data-gs-y={y}
      data-gs-width={width}
      data-gs-height={height}
    >
      <div className="grid-stack-item-content">
        {children}
      </div>
    </div>
  );
}