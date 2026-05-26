import { Users } from 'lucide-react';

export default function TableGrid({ tables, onTableClick }) {
  // Array de 1 a 50 para renderizar as mesas
  const tableNumbers = Array.from({ length: 50 }, (_, i) => i + 1);

  const getTableStatus = (tableId) => {
    const table = tables[tableId];
    if (!table || table.items.length === 0) return 'free';
    return 'occupied';
  };

  const getTableTotal = (tableId) => {
    const table = tables[tableId];
    if (!table) return 0;
    return table.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '1.25rem',
      padding: '1.25rem'
    }}>
      {tableNumbers.map(number => {
        const status = getTableStatus(number);
        const total = getTableTotal(number);
        
        return (
          <div 
            key={number}
            className={`glass-panel table-card ${status === 'free' ? 'table-free' : 'table-occupied'}`}
            onClick={() => onTableClick(number)}
            style={{
              padding: '1.5rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              minHeight: '130px',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>Mesa {number}</span>
            {status === 'occupied' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> Ocupada
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>
                  R$ {total.toFixed(2)}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Livre</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
