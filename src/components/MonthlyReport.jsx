import { useState } from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Calendar } from 'lucide-react';

export default function MonthlyReport({ history, expenses, onAddExpense, onDeleteExpense, onClose }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM

  const handleAdd = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;
    onAddExpense({
      id: Date.now().toString(),
      description: desc,
      amount: parseFloat(amount),
      date: new Date().toISOString()
    });
    setDesc('');
    setAmount('');
  };

  // Filtering data by selected month
  const filteredHistory = history.filter(item => item.timestamp.startsWith(selectedMonth));
  const filteredExpenses = expenses.filter(item => item.date.startsWith(selectedMonth));

  const totalIn = filteredHistory.reduce((sum, item) => sum + item.total, 0);
  const totalOut = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIn - totalOut;

  const monthName = new Date(selectedMonth + '-02').toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ padding: '1.5rem', maxWidth: '800px', width: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Relatório Mensal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Acompanhe suas entradas e saídas</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.25rem' }}>
            <X size={24} />
          </button>
        </div>

        {/* Month Selector */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={20} color="var(--primary)" />
          <input 
            type="month" 
            className="input" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: '200px' }}
          />
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Entradas</span>
              <TrendingUp size={20} color="var(--success)" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>R$ {totalIn.toFixed(2)}</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Saídas</span>
              <TrendingDown size={20} color="var(--danger)" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>R$ {totalOut.toFixed(2)}</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Saldo Líquido</span>
              <DollarSign size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>R$ {balance.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Expenses Registration */}
          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Registrar Saída (Despesa)</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Descrição (ex: Aluguel, Fornecedor)" 
                className="input"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Valor R$" 
                  className="input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-danger" style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={18} />
                  Adicionar
                </button>
              </div>
            </form>

            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Lista de Saídas do Mês</h4>
              {filteredExpenses.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Nenhuma saída registrada.</p>
              ) : (
                filteredExpenses.map(exp => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem' }}>{exp.description}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(exp.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--danger)' }}>- R$ {exp.amount.toFixed(2)}</span>
                      <button className="btn btn-ghost" onClick={() => onDeleteExpense(exp.id)} style={{ padding: '0.25rem', color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Income Summary */}
          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Resumo de Entradas</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredHistory.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Nenhuma entrada registrada.</p>
              ) : (
                filteredHistory.map(entry => (
                  <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem' }}>Mesa {entry.tableId}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(entry.timestamp).toLocaleString()}</div>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>+ R$ {entry.total.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
