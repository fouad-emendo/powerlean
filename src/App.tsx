import { useState } from 'react';
import { GridStack, GridItem } from './components/GridStack';
import { Widget } from './components/Widget';
import { FileUpload } from './components/FileUpload';

interface Website {
  url: string;
  title: string;
}

interface Websites {
  [key: string]: Website;
}

function App() {
  const [websites, setWebsites] = useState<Websites>({});
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const handleEditWidget = (widgetId: string) => {
    setSelectedWidget(widgetId);
    const url = prompt('Enter website URL:');
    if (url) {
      const title = prompt('Enter website title:') || url;
      setWebsites(prev => ({
        ...prev,
        [widgetId]: {
          url: url.startsWith('http') ? url : `https://${url}`,
          title
        }
      }));
    }
  };

  // Generate initial grid items
  const gridItems = Array.from({ length: 9 }, (_, i) => {
    const x = i % 3;
    const y = Math.floor(i / 3);
    const id = `widget-${i}`;

    return (
      <GridItem key={id} x={x} y={y} id={id}>
        <Widget
          id={id}
          number={i + 1}
          link={websites[id]}
          onEdit={() => handleEditWidget(id)}
        />
      </GridItem>
    );
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>PowerLean Grid</h1>
        {selectedWidget && (
          <p>Selected Widget: {selectedWidget}</p>
        )}
      </header>
      
      <main className="app-content">
        <GridStack>
          {gridItems}
        </GridStack>
      </main>

      <aside className="app-sidebar">
        <FileUpload />
      </aside>
    </div>
  );
}

export default App; 