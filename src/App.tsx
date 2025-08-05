import { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GridStack, GridStackWidget } from 'gridstack';
import { Widget } from './components/Widget';
import Dropdown from './components/Dropdown';
import 'gridstack/dist/gridstack.min.css';
import './styles.css';

interface Website {
  url: string;
  title: string;
}

interface Websites {
  [key: string]: Website;
}

const App = () => {
  const [websites, setWebsites] = useState<Websites>({});
  const gridRef = useRef<GridStack | null>(null);
  const rootsRef = useRef<Map<string, any>>(new Map());
  let newWidgetCounter = 0;

  const getNextWidgetId = () => `widget-${newWidgetCounter++}`;

  const initializeGrid = () => {
     const grid = GridStack.init({
       float: false,
       cellHeight: 200,
       column: 6,
       minRow: 1,
       removable: '#trash',
     });
     gridRef.current = grid;
     return grid;
   };

  const addNewWidget = () => {
     const grid = gridRef.current;
     if (!grid) return;
 
     const widgetId = getNextWidgetId();
    
    // Create a DOM element first
    const el = document.createElement('div');
    el.className = 'grid-stack-item';
    el.setAttribute('data-gs-id', widgetId);
    el.setAttribute('data-gs-x', Math.floor(Math.random() * 10).toString());
    el.setAttribute('data-gs-y', Math.floor(Math.random() * 5).toString());
    el.setAttribute('data-gs-width', '3');
    el.setAttribute('data-gs-height', '3');
    
    const content = document.createElement('div');
    content.className = 'grid-stack-item-content';
    
    const inner = document.createElement('div');
    inner.className = 'grid-stack-item-content-inner';
    inner.id = widgetId;
    
    content.appendChild(inner);
    el.appendChild(content);
    
    grid.addWidget(el);
    renderWidgetContent(widgetId);
  };

  const removeWidget = (id: string) => {
    // Clean up React root
    const root = rootsRef.current.get(id);
    if (root) {
      root.unmount();
      rootsRef.current.delete(id);
    }
    
    setWebsites(prev => {
      const newWebsites = { ...prev };
      delete newWebsites[id];
      return newWebsites;
    });
    const el = document.querySelector(`[data-gs-id="${id}"]`);
    if (el && gridRef.current) {
      gridRef.current.removeWidget(el as HTMLElement, true);
    }
  };

  const renderWidgetContent = (id: string) => {
     // Add a small delay to ensure DOM element exists
     setTimeout(() => {
       const container = document.getElementById(id);
       if (!container) {
         console.warn(`Container not found for widget ${id}`);
         return;
       }
 
      // Get or create React root for this container
      let root = rootsRef.current.get(id);
      if (!root) {
        root = createRoot(container);
        rootsRef.current.set(id, root);
      }
       
      root.render(
         <Widget
           id={id}
           link={websites[id]}
           onEdit={() => editWidget(id)}
           onRemove={() => removeWidget(id)}
         />
       );
     }, 10);
  };
  
  const editWidget = (id: string) => {
    const url = prompt('Enter website URL:');
    if (url) {
        const title = prompt('Enter website title:') || url;
        setWebsites(prev => ({
            ...prev,
            [id]: {
                url: url.startsWith('http') ? url : `https://${url}`,
                title
            }
        }));
    }
  };

  const saveLayout = () => {
    if (!gridRef.current) return;
    const layout = gridRef.current.save(true) as GridStackWidget[];
    localStorage.setItem('gridLayout', JSON.stringify({ layout, websites }));
  };

  const loadLayout = () => {
    const savedLayout = localStorage.getItem('gridLayout');
    if (savedLayout && gridRef.current) {
      const { layout, websites: savedWebsites } = JSON.parse(savedLayout);
      gridRef.current.load(layout);
      setWebsites(savedWebsites);
      // Render content for each widget in the loaded layout
      layout.forEach((item: GridStackWidget) => {
        if (item.id) {
          renderWidgetContent(item.id as string);
        }
      });
      return true;
    }
    return false;
  };
  
  const resetLayout = () => {
    // Clean up all React roots
    rootsRef.current.forEach(root => root.unmount());
    rootsRef.current.clear();
    
    if (gridRef.current) {
      gridRef.current.removeAll();
    }
    setWebsites({});
    localStorage.removeItem('gridLayout');
  };

  const createLayout = (rows: number, cols: number) => {
     if (!gridRef.current) return;
    
    // Clean up all existing React roots first
    rootsRef.current.forEach(root => root.unmount());
    rootsRef.current.clear();
    
     gridRef.current.removeAll();
     setWebsites({}); // Clear website data when creating new layout
 
     const elements: HTMLElement[] = [];
     for (let i = 0; i < rows * cols; i++) {
       const widgetId = `widget-${i}`;
       
       // Create DOM element
       const el = document.createElement('div');
       el.className = 'grid-stack-item';
       el.setAttribute('data-gs-id', widgetId);
       el.setAttribute('data-gs-x', ((i % cols) * 3).toString());
       el.setAttribute('data-gs-y', (Math.floor(i / cols) * 3).toString());
       el.setAttribute('data-gs-width', '3');
       el.setAttribute('data-gs-height', '3');
       
       const content = document.createElement('div');
       content.className = 'grid-stack-item-content';
       
       const inner = document.createElement('div');
       inner.className = 'grid-stack-item-content-inner';
       inner.id = widgetId;
       
       content.appendChild(inner);
       el.appendChild(content);
       elements.push(el);
     }
     
     // Add each element to the grid
     elements.forEach(el => gridRef.current!.addWidget(el));
     newWidgetCounter = rows * cols;
     
    // Render content for each widget immediately since DOM is ready
    elements.forEach(el => {
      const widgetId = el.getAttribute('data-gs-id');
      if (widgetId) renderWidgetContent(widgetId);
    });
  };
  
  useEffect(() => {
    const grid = initializeGrid();
    grid.on('added', (_event, items) => {
      items.forEach(item => {
        if (item.id) renderWidgetContent(item.id);
      });
    });
    const loaded = loadLayout();
    if (!loaded) {
      // No saved layout – start with a default 3x3 grid
      createLayout(3, 3);
    }
  }, []);
  
  useEffect(() => {
    Object.keys(websites).forEach(id => {
      renderWidgetContent(id);
    });
  }, [websites]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>PowerLean Grid</h1>
        <div className="grid-controls">
          <Dropdown
            trigger={
              <button className="control-btn">Layouts</button>
            }
          >
            <div className="dropdown-item" onClick={() => createLayout(2, 2)}>2x2</div>
            <div className="dropdown-item" onClick={() => createLayout(3, 3)}>3x3</div>
            <div className="dropdown-item" onClick={() => createLayout(3, 4)}>3x4</div>
          </Dropdown>
          <button onClick={addNewWidget} className="control-btn primary">Add Widget</button>
          <button onClick={saveLayout} className="control-btn">Save Layout</button>
          <button onClick={loadLayout} className="control-btn">Load Layout</button>
          <button onClick={resetLayout} className="control-btn">Reset Grid</button>
        </div>
      </header>
      <main className="app-content">
        <div className="grid-stack"></div>
        <div id="trash" style={{ padding: '20px', border: '2px dashed red', textAlign: 'center' }}>
          Drag here to remove
        </div>
      </main>
    </div>
  );
};

export default App; 