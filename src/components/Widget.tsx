import React, { useCallback } from 'react';

interface WidgetProps {
  id: string;
  link?: {
    url: string;
    title: string;
  };
  onEdit?: () => void;
  onRemove?: () => void;
}

export function Widget({ id, link, onEdit, onRemove }: WidgetProps) {
  const handleRefresh = useCallback(() => {
    const iframe = document.querySelector(`[data-widget-id="${id}"] iframe`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  }, [id]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div className="widget-container" data-widget-id={id}>
      <div className="widget-header">
        <div className="widget-controls">
          <button className="widget-btn" onClick={handleEdit} title="Edit URL">🔗</button>
          <button className="widget-btn" onClick={handleRefresh} title="Refresh">🔄</button>
          <button className="widget-btn" onClick={handleRemove} title="Remove">❌</button>
        </div>
      </div>
      <div className="widget-body width-100 height-100">
        {link ? (
          <iframe
            src={link.url}
            className="widget-frame"
            title={link.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="lazy"
          />
        ) : (
          <div className="empty-widget" onClick={handleEdit}>
            <div className="add-icon">+</div>
            <div>Add Web Page or Power App</div>
          </div>
        )}
      </div>
    </div>
  );
}