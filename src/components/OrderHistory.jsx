import { X, Calendar, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function OrderHistory({ history, onClear, onClose }) {
  const [expandedId, setExpandedId] = useState(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ padding: '1.5rem', width: '95%', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Histórico de Fechamentos</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost" onClick={onClear} style={{ color: 'var(--danger)', padding: '0.5rem' }}>
              <Trash2 size={18} />
            </button>
            <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.5rem' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              Nenhum histórico disponível.
            </p>
          ) : (
            history.map(entry => (
              <div key={entry.id} className="glass-panel" style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--border-color)',
                overflow: 'hidden'
              }}>
                <div 
                  onClick={() => toggleExpand(entry.id)}
                  style={{ 
                    padding: '1rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      background: 'var(--primary)', 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      {entry.tableId}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {formatDate(entry.timestamp)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {formatTime(entry.timestamp)}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--success)', marginTop: '2px' }}>
                        Total: R$ {entry.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {expandedId === entry.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {expandedId === entry.id && (
                  <div style={{ 
                    padding: '0 1rem 1rem 1rem', 
                    borderTop: '1px solid var(--border-color)',
                    background: 'rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {entry.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
