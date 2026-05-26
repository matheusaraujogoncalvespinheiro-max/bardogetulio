import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import TableGrid from './components/TableGrid.jsx';
import TableDetails from './components/TableDetails.jsx';
import ProductCatalog from './components/ProductCatalog.jsx';
import OrderHistory from './components/OrderHistory.jsx';
import Login from './components/Login.jsx';
import MonthlyReport from './components/MonthlyReport.jsx';
import DbConfigModal from './components/DbConfigModal.jsx';
import QuickCashier from './components/QuickCashier.jsx';

import { db, isConfigured } from './firebase.js';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  writeBatch 
} from 'firebase/firestore';

const initialProducts = [
  { id: '1', code: '001', name: 'Cerveja 600ml', price: 12.00 },
  { id: '2', code: '002', name: 'Refrigerante Lata', price: 6.00 },
  { id: '3', code: '003', name: 'Porção de Fritas', price: 35.00 },
  { id: '4', code: '004', name: 'Escondidinho', price: 45.00 },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('bar_auth') === 'true';
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('bar_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (e) { return initialProducts; }
  });

  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem('bar_tables');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('bar_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('bar_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [isDbConfigOpen, setIsDbConfigOpen] = useState(false);
  const [isQuickCashierOpen, setIsQuickCashierOpen] = useState(false);

  // 1. Sincronização e Migração Automática com Firebase
  useEffect(() => {
    if (!isConfigured) return;

    const syncAndMigrate = async () => {
      try {
        console.log("🔄 Iniciando sincronização e verificação de migração do Firebase...");
        
        // A. Migrar Produtos se vazio na nuvem
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          console.log("📤 Migrando produtos do LocalStorage para o Firestore...");
          const batch = writeBatch(db);
          products.forEach((p) => {
            batch.set(doc(db, 'products', String(p.id)), {
              code: p.code,
              name: p.name,
              price: Number(p.price)
            });
          });
          await batch.commit();
        }

        // B. Migrar Mesas se vazio na nuvem
        const tabSnap = await getDocs(collection(db, 'tables'));
        if (tabSnap.empty && Object.keys(tables).length > 0) {
          console.log("📤 Migrando mesas ativas do LocalStorage para o Firestore...");
          const batch = writeBatch(db);
          Object.entries(tables).forEach(([tableId, tableData]) => {
            if (tableData && tableData.items && tableData.items.length > 0) {
              batch.set(doc(db, 'tables', String(tableId)), {
                items: tableData.items,
                updatedAt: new Date().toISOString()
              });
            }
          });
          await batch.commit();
        }

        // C. Migrar Histórico se vazio na nuvem
        const histSnap = await getDocs(collection(db, 'history'));
        if (histSnap.empty && history.length > 0) {
          console.log("📤 Migrando histórico de vendas para o Firestore...");
          const batch = writeBatch(db);
          history.forEach((h) => {
            batch.set(doc(db, 'history', String(h.id)), {
              tableId: String(h.tableId),
              items: h.items,
              total: Number(h.total),
              timestamp: h.timestamp
            });
          });
          await batch.commit();
        }

        // D. Migrar Despesas se vazio na nuvem
        const expSnap = await getDocs(collection(db, 'expenses'));
        if (expSnap.empty && expenses.length > 0) {
          console.log("📤 Migrando despesas para o Firestore...");
          const batch = writeBatch(db);
          expenses.forEach((e) => {
            batch.set(doc(db, 'expenses', String(e.id)), {
              description: e.description,
              amount: Number(e.amount),
              date: e.date
            });
          });
          await batch.commit();
        }
      } catch (err) {
        console.error("⚠️ Erro na migração automática:", err);
      }
    };

    syncAndMigrate();

    // Ouvintes em tempo real para sincronização multi-usuário
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (list.length > 0) {
        setProducts(list);
      }
    });

    const unsubTables = onSnapshot(collection(db, 'tables'), (snapshot) => {
      const data = {};
      snapshot.docs.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setTables(data);
    });

    const unsubHistory = onSnapshot(collection(db, 'history'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setHistory(list);
    });

    const unsubExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(list);
    });

    return () => {
      unsubProducts();
      unsubTables();
      unsubHistory();
      unsubExpenses();
    };
  }, [isConfigured]);

  // 2. Persistência de Fallback do LocalStorage (Apenas se o Firebase NÃO estiver configurado)
  useEffect(() => {
    localStorage.setItem('bar_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isConfigured) {
      localStorage.setItem('bar_products', JSON.stringify(products));
    }
  }, [products, isConfigured]);

  useEffect(() => {
    if (!isConfigured) {
      localStorage.setItem('bar_tables', JSON.stringify(tables));
    }
  }, [tables, isConfigured]);

  useEffect(() => {
    if (!isConfigured) {
      localStorage.setItem('bar_history', JSON.stringify(history));
    }
  }, [history, isConfigured]);

  useEffect(() => {
    if (!isConfigured) {
      localStorage.setItem('bar_expenses', JSON.stringify(expenses));
    }
  }, [expenses, isConfigured]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    if (window.confirm('Deseja sair do sistema?')) {
      setIsAuthenticated(false);
    }
  };

  const handleAddProduct = async (product) => {
    if (isConfigured) {
      try {
        await setDoc(doc(db, 'products', String(product.id)), {
          code: product.code,
          name: product.name,
          price: Number(product.price)
        });
      } catch (e) { console.error("Erro ao adicionar produto:", e); }
    } else {
      setProducts(prev => [...prev, product]);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    if (isConfigured) {
      try {
        await setDoc(doc(db, 'products', String(updatedProduct.id)), {
          code: updatedProduct.code,
          name: updatedProduct.name,
          price: Number(updatedProduct.price)
        });
      } catch (e) { console.error("Erro ao atualizar produto:", e); }
    } else {
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (isConfigured) {
      try {
        await deleteDoc(doc(db, 'products', String(productId)));
      } catch (e) { console.error("Erro ao deletar produto:", e); }
    } else {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleAddExpense = async (expense) => {
    if (isConfigured) {
      try {
        await setDoc(doc(db, 'expenses', String(expense.id)), {
          description: expense.description,
          amount: Number(expense.amount),
          date: expense.date
        });
      } catch (e) { console.error("Erro ao adicionar despesa:", e); }
    } else {
      setExpenses(prev => [...prev, expense]);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (isConfigured) {
      try {
        await deleteDoc(doc(db, 'expenses', String(id)));
      } catch (e) { console.error("Erro ao deletar despesa:", e); }
    } else {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAddItemToTable = async (tableId, item) => {
    const id = String(tableId);
    const table = tables[id] || { items: [] };
    
    const existingItemIndex = table.items.findIndex(i => i.id === item.id);
    let newItems;

    if (existingItemIndex > -1) {
      newItems = [...table.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + item.quantity
      };
    } else {
      newItems = [...table.items, item];
    }

    if (isConfigured) {
      try {
        await setDoc(doc(db, 'tables', id), {
          items: newItems,
          updatedAt: new Date().toISOString()
        });
      } catch (e) { console.error("Erro ao adicionar item à mesa:", e); }
    } else {
      setTables(prev => ({
        ...prev,
        [id]: {
          ...table,
          items: newItems
        }
      }));
    }
  };

  const handleRemoveItemFromTable = async (tableId, itemIndex) => {
    const id = String(tableId);
    const table = tables[id];
    if (!table) return;
    
    const newItems = [...table.items];
    newItems.splice(itemIndex, 1);

    if (isConfigured) {
      try {
        if (newItems.length === 0) {
          await deleteDoc(doc(db, 'tables', id));
        } else {
          await setDoc(doc(db, 'tables', id), {
            items: newItems,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (e) { console.error("Erro ao remover item da mesa:", e); }
    } else {
      setTables(prev => ({
        ...prev,
        [id]: {
          ...table,
          items: newItems
        }
      }));
    }
  };

  const handleCloseBill = async (tableId, total) => {
    const id = String(tableId);
    const tableData = tables[id];
    
    if (!tableData) {
      alert("Erro: Mesa não encontrada.");
      return;
    }

    const historyEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      tableId: id,
      items: [...tableData.items],
      total: Number(total),
      timestamp: new Date().toISOString()
    };

    if (isConfigured) {
      try {
        // Registrar no histórico
        await setDoc(doc(db, 'history', historyEntry.id), {
          tableId: historyEntry.tableId,
          items: historyEntry.items,
          total: historyEntry.total,
          timestamp: historyEntry.timestamp
        });
        // Deletar da mesa ativa
        await deleteDoc(doc(db, 'tables', id));
      } catch (e) { console.error("Erro ao fechar conta:", e); }
    } else {
      setHistory(prev => [historyEntry, ...prev]);
      setTables(prev => {
        const newTables = { ...prev };
        delete newTables[id];
        return newTables;
      });
    }
    return historyEntry;
  };

  const clearHistory = async () => {
    if (window.confirm('Limpar histórico?')) {
      if (isConfigured) {
        try {
          const snapshot = await getDocs(collection(db, 'history'));
          const batch = writeBatch(db);
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
        } catch (e) { console.error("Erro ao limpar histórico:", e); }
      } else {
        setHistory([]);
      }
    }
  };

  const handleCompleteQuickSale = async (tableId, total, items, paymentMethod) => {
    const historyEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      tableId: String(tableId),
      items: [...items],
      total: Number(total),
      timestamp: new Date().toISOString(),
      paymentMethod: String(paymentMethod)
    };

    if (isConfigured) {
      try {
        await setDoc(doc(db, 'history', historyEntry.id), {
          tableId: historyEntry.tableId,
          items: historyEntry.items,
          total: historyEntry.total,
          timestamp: historyEntry.timestamp,
          paymentMethod: historyEntry.paymentMethod
        });
      } catch (e) {
        console.error("Erro ao salvar venda direta no Firebase:", e);
        throw e;
      }
    } else {
      setHistory(prev => [historyEntry, ...prev]);
    }
    return historyEntry;
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2rem' }}>
      <Header 
        onOpenCatalog={() => setIsCatalogOpen(true)} 
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onLogout={handleLogout}
        isConfigured={isConfigured}
        onOpenDbConfig={() => setIsDbConfigOpen(true)}
        onOpenQuickCashier={() => setIsQuickCashierOpen(true)}
      />
      
      <main>
        <TableGrid tables={tables} onTableClick={(id) => setSelectedTableId(id)} />
      </main>

      {isCatalogOpen && (
        <ProductCatalog 
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onClose={() => setIsCatalogOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <OrderHistory 
          history={history}
          onClear={clearHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isReportOpen && (
        <MonthlyReport 
          history={history}
          expenses={expenses}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {selectedTableId && (
        <TableDetails 
          tableId={selectedTableId}
          tableData={tables[String(selectedTableId)] || { items: [] }}
          products={products}
          onClose={() => setSelectedTableId(null)}
          onAddItem={handleAddItemToTable}
          onRemoveItem={handleRemoveItemFromTable}
          onCloseBill={handleCloseBill}
        />
      )}

      {isDbConfigOpen && (
        <DbConfigModal onClose={() => setIsDbConfigOpen(false)} />
      )}

      {isQuickCashierOpen && (
        <QuickCashier 
          products={products}
          onClose={() => setIsQuickCashierOpen(false)}
          onCompleteSale={handleCompleteQuickSale}
        />
      )}
    </div>
  );
}

export default App;
