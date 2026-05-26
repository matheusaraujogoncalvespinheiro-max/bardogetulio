import { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function ProductCatalog({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onClose }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [code, setCode] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = code.trim();
    
    if (!trimmedName || !price || !trimmedCode) {
      alert("Por favor, preencha todos os campos (Código, Nome e Preço).");
      return;
    }
    
    // Check for duplicate code
    const exists = products.some(p => p.code === trimmedCode);
    if (exists) {
      alert(`O código "${trimmedCode}" já está em uso por outro produto.`);
      return;
    }
    
    onAddProduct({
      id: Date.now().toString(),
      code: trimmedCode,
      name: trimmedName,
      price: parseFloat(price)
    });
    
    setName('');
    setPrice('');
    setCode('');
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditPrice(product.price.toString());
  };

  const saveEdit = (product) => {
    onUpdateProduct({
      ...product,
      price: parseFloat(editPrice)
    });
    setEditingId(null);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Catálogo de Produtos</h2>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Cód." 
            className="input" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ flex: '0 0 80px' }}
          />
          <input 
            type="text" 
            placeholder="Nome do produto" 
            className="input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: '2 1 150px' }}
          />
          <input 
            type="number" 
            placeholder="Preço (R$)" 
            className="input"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ flex: '1 1 100px' }}
          />
          <button type="submit" className="btn btn-success">
            <Plus size={20} />
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {products.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>
              Nenhum produto cadastrado.
            </p>
          ) : (
            products.map(product => (
              <div key={product.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                    [{product.code}]
                  </span>
                  <span>{product.name}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {editingId === product.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        className="input"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: '80px', padding: '0.25rem 0.5rem' }}
                      />
                      <button 
                        className="btn btn-success" 
                        onClick={() => saveEdit(product)}
                        style={{ padding: '0.25rem' }}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                        R$ {product.price.toFixed(2)}
                      </span>
                      <button 
                        className="btn btn-ghost" 
                        onClick={() => startEditing(product)}
                        style={{ padding: '0.25rem' }}
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="btn btn-ghost" 
                    onClick={() => onDeleteProduct(product.id)}
                    style={{ padding: '0.25rem', color: 'var(--danger)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
