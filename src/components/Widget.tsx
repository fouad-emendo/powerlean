interface WidgetProps {
  id: string;
  number: number;
  link?: {
    url: string;
    title: string;
  };
  onEdit?: () => void;
}

export function Widget({ id, number, link, onEdit }: WidgetProps) {
  return (
    <div className="widget-container" data-widget={id}>
      <div className="widget-header">
        <span className="widget-number">{number}</span>
        <button className="edit-btn" onClick={onEdit}>⚙️</button>
      </div>
      <div className="widget-body">
        {link ? (
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="widget-link"
          >
            <strong>{link.title}</strong>
            <small>{link.url.replace(/^https?:\/\//, '')}</small>
          </a>
        ) : (
          <div className="empty-widget">
            <span className="add-icon">+</span>
            <span>Click to add link</span>
          </div>
        )}
      </div>
    </div>
  );
} 