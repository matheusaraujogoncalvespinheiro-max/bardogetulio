import { Users } from 'lucide-react';

export default function TableGrid({ tables, onTableClick }) {
  // Array de 1 a 90 para renderizar as mesas
  const tableNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

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
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '1rem',
      padding: '1rem'
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
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '100px'
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{number}</span>
            {status === 'occupied' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} /> Ocupada
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>
                  R$ {total.toFixed(2)}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Livre</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
