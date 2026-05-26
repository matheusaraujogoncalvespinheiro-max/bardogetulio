import { useState } from 'react';
import { X, CheckCircle, Trash2, Plus, Printer, AlertTriangle, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function TableDetails({ 
  tableId, 
  tableData, 
  products, 
  onClose, 
  onAddItem, 
  onRemoveItem, 
  onCloseBill 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [closedData, setClosedData] = useState(null);
  
  const [searchCode, setSearchCode] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const items = tableData?.items || [];
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSearchCode = () => {
    if (!searchCode) return;
    const product = products.find(p => p.code === searchCode);
    if (product) {
      setSelectedProductId(product.id);
      setQuantity('');
    } else {
      alert("Produto não encontrado com este código.");
      setSelectedProductId('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchCode();
  };

  const handleAdd = () => {
    const qty = parseInt(quantity);
    if (!selectedProductId || isNaN(qty) || qty < 1) {
      alert("Informe uma quantidade válida.");
      return;
    }
    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      onAddItem(tableId, { ...product, quantity: qty });
      setSelectedProductId('');
      setSearchCode('');
      setQuantity('');
      setIsAdding(false);
    }
  };

  const handleConfirmClose = () => {
    const result = onCloseBill(tableId, total);
    if (result) {
      setClosedData(result);
      setIsClosed(true);
    }
  };

  const handlePrint = () => {
    const data = closedData || { tableId, items, total, timestamp: new Date().toISOString() };
    const printWindow = window.open('', '_blank');
    const dateStr = new Date(data.timestamp).toLocaleString('pt-BR');
    
    const html = `
      <html>
        <head>
          <title>Mesa ${data.tableId} - Bar do Getúlio</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 300px; margin: 0 auto; padding: 20px; color: #000; }
            h1 { text-align: center; font-size: 1.2rem; margin: 0; }
            p { text-align: center; font-size: 0.8rem; margin: 5px 0; }
            .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 3px; }
            .total { font-weight: bold; font-size: 1.1rem; text-align: right; margin-top: 10px; }
            .footer { text-align: center; font-size: 0.7rem; margin-top: 20px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <h1>BAR DO GETÚLIO</h1>
          <p>Comprovante de Consumo</p>
          <div class="divider"></div>
          <p>Mesa: ${data.tableId} | Data: ${dateStr}</p>
          <div class="divider"></div>
          ${data.items.map(item => `
            <div class="item">
              <span>${item.quantity}x ${item.name}</span>
              <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="total">TOTAL: R$ ${data.total.toFixed(2)}</div>
          <div class="footer">Obrigado pela preferência!</div>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // View: Success after closing
  if (isClosed) {
    return (
      <div className="modal-overlay">
        <div className="glass-panel modal-content" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ color: 'var(--success)', marginBottom: '1.5rem' }}>
            <CheckCircle size={64} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Mesa {tableId} Fechada!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>A conta foi registrada no histórico com sucesso.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '1rem' }}>
              <Printer size={20} />
              <span>Imprimir Nota</span>
            </button>
            <button className="btn btn-ghost" onClick={onClose} style={{ padding: '1rem' }}>
              <span>Concluir</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View: Confirmation of closure
  if (isConfirming) {
    return (
      <div className="modal-overlay">
        <div className="glass-panel modal-content" style={{ padding: '2rem', maxWidth: '450px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--warning)', marginBottom: '1.5rem' }}>
            <AlertTriangle size={32} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Confirmar Fechamento?</h2>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Mesa selecionada</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Mesa {tableId}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total a pagar</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-ghost" onClick={() => setIsConfirming(false)} style={{ flex: 1, padding: '1rem' }}>
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </button>
            <button className="btn btn-success" onClick={handleConfirmClose} style={{ flex: 2, padding: '1rem' }}>
              <CheckCircle size={20} />
              <span>Confirmar e Fechar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '80vh',
        width: '95%',
        maxWidth: '700px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Mesa {tableId}</h2>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={24} />
          </button>
        </div>

        {/* Add Product Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          {!isAdding ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setIsAdding(true)}
              style={{ width: '100%', padding: '1.5rem', fontSize: '1.5rem', borderRadius: '12px' }}
            >
              <Plus size={32} />
              <span>Adicionar Produto</span>
            </button>
          ) : (
            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--primary)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {!selectedProduct ? 'Escaneie ou digite o código' : 'Informe a quantidade'}
                </span>
                <button className="btn btn-ghost" onClick={() => {
                  setIsAdding(false);
                  setSearchCode('');
                  setSelectedProductId('');
                }} style={{ padding: '0.25rem' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: '1 1 150px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Código</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input 
                      type="text" 
                      placeholder="Ex: 001" 
                      className="input"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      disabled={!!selectedProduct}
                    />
                    {!selectedProduct && (
                      <button className="btn btn-primary" onClick={handleSearchCode} style={{ padding: '0 0.75rem' }}>
                        OK
                      </button>
                    )}
                  </div>
                </div>

                {selectedProduct && (
                  <>
                    <div style={{ flex: '2 1 200px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Produto</label>
                      <div className="input" style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                        {selectedProduct.image && (
                          <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                        )}
                        <span>{selectedProduct.name}</span>
                      </div>
                    </div>
                    <div style={{ width: '80px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Qtd.</label>
                      <input 
                        type="number" 
                        placeholder="Ex: 1"
                        className="input" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        min="1"
                        autoFocus
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button 
                        className="btn btn-success" 
                        onClick={handleAdd}
                        style={{ height: '42px', padding: '0 1.5rem' }}
                      >
                        <CheckCircle size={20} />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              Mesa vazia. Adicione produtos acima.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1.25rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Imagem do Produto consumido */}
                    {item.image ? (
                      <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <ImageIcon size={20} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}

                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          [{item.code}]
                        </span>
                        <span style={{ color: 'var(--accent-color, #ffd700)' }}>{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Preço unitário: R$ {item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-color)' }}>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      className="btn btn-ghost" 
                      onClick={() => onRemoveItem(tableId, index)}
                      style={{ padding: '0.4rem', color: 'var(--danger)' }}
                      title="Remover item da mesa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Total */}
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '1.25rem', 
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Total da Conta</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)' }}>
              R$ {total.toFixed(2)}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-ghost" 
              onClick={handlePrint}
              disabled={items.length === 0}
              style={{ padding: '1rem' }}
              title="Visualizar Impressão"
            >
              <Printer size={22} />
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => setIsConfirming(true)}
              disabled={items.length === 0}
              style={{ opacity: items.length === 0 ? 0.5 : 1, padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 600 }}
            >
              <CheckCircle size={22} />
              <span>Fechar Conta</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
