import { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check, Image as ImageIcon } from 'lucide-react';

export default function ProductCatalog({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onClose }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [code, setCode] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  
  // Estados para o Balão de Imagem
  const [balloonProductId, setBalloonProductId] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState('');

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
      price: parseFloat(price),
      image: '' // Inicia sem imagem
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

  // Toggle do Balão de Imagem
  const toggleBalloon = (product) => {
    if (balloonProductId === product.id) {
      setBalloonProductId(null);
      setTempImageUrl('');
    } else {
      setBalloonProductId(product.id);
      setTempImageUrl(product.image || '');
    }
  };

  // Salvar a Imagem do Balão
  const handleSaveImage = (product) => {
    onUpdateProduct({
      ...product,
      image: tempImageUrl.trim()
    });
    setBalloonProductId(null);
    setTempImageUrl('');
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ padding: '1.5rem', overflow: 'visible' }}>
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
                borderRadius: '8px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Círculo Interativo da Imagem (Abre Balão) */}
                  <button
                    onClick={() => toggleBalloon(product)}
                    type="button"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      border: product.image ? '1px solid var(--accent-color, #ffd700)' : '1px dashed rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s'
                    }}
                    title="Clique para adicionar/alterar imagem via Link"
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={16} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      [{product.code}]
                    </span>
                    <span style={{ fontSize: '0.925rem', fontWeight: 500 }}>{product.name}</span>
                  </div>
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

                {/* Balão de Imagem (Popover) */}
                {balloonProductId === product.id && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '12px',
                    zIndex: 100,
                    background: '#1a1a26',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
                    width: '290px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    marginTop: '8px'
                  }}>
                    {/* Seta do Balão */}
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '18px',
                      width: '0',
                      height: '0',
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderBottom: '8px solid rgba(255, 215, 0, 0.3)',
                    }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-color, #ffd700)' }}>📷 Link da Imagem do Produto</span>
                      <button 
                        onClick={() => setBalloonProductId(null)}
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.1rem' }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <input 
                        type="text" 
                        placeholder="Cole o link (URL) da imagem..." 
                        className="input" 
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem' }}
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSaveImage(product)}
                        type="button"
                        className="btn btn-success"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        OK
                      </button>
                    </div>

                    {tempImageUrl.trim() && (
                      <div style={{ 
                        width: '100%', 
                        height: '110px', 
                        borderRadius: '6px', 
                        overflow: 'hidden', 
                        background: 'rgba(0,0,0,0.3)', 
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={tempImageUrl} 
                          alt="Previsualização" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200'; }}
                        />
                      </div>
                    )}
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
