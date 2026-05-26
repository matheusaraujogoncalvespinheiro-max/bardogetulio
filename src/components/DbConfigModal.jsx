import React, { useState } from 'react';
import { X, Database, FileText, Check, Copy, HelpCircle } from 'lucide-react';

export default function DbConfigModal({ onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [copied, setCopied] = useState(false);

  const envContent = `# Configurações do Firebase - Bar do Getúlio
VITE_FIREBASE_API_KEY=${apiKey || 'SUA_API_KEY'}
VITE_FIREBASE_AUTH_DOMAIN=${authDomain || 'SEU_AUTH_DOMAIN'}
VITE_FIREBASE_PROJECT_ID=${projectId || 'SEU_PROJECT_ID'}
VITE_FIREBASE_STORAGE_BUCKET=${storageBucket || 'SEU_STORAGE_BUCKET'}
VITE_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId || 'SEU_MESSAGING_SENDER_ID'}
VITE_FIREBASE_APP_ID=${appId || 'SEU_APP_ID'}`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 100 }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative'
      }}>
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            color: '#fbbf24',
            padding: '0.5rem',
            borderRadius: '12px'
          }}>
            <Database size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Configuração do Banco de Dados</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Conecte seu sistema ao Firebase para sincronização multi-dispositivo em tempo real.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} style={{ color: '#fbbf24' }} />
            Passo a Passo de Instalação:
          </h3>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            padding: '1rem', 
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div><strong>1. Crie seu projeto:</strong> Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: '#fbbf24', textDecoration: 'underline' }}>Firebase Console</a> e adicione um novo projeto gratuitamente.</div>
            <div><strong>2. Ative o Firestore:</strong> Clique em "Firestore Database" no menu lateral esquerdo e depois em "Criar banco de dados". Escolha a opção "Iniciar no modo de teste" para liberar as leituras/gravações iniciais.</div>
            <div><strong>3. Registre seu App:</strong> No painel inicial do projeto, clique no ícone da Web (<strong>&lt;/&gt;</strong>) para registrar um aplicativo. Copie o objeto <code>firebaseConfig</code> gerado.</div>
            <div><strong>4. Configure o arquivo:</strong> Crie um arquivo chamado <code>.env</code> na pasta raiz do seu projeto e cole os dados, ou preencha o assistente abaixo para gerar o conteúdo do arquivo pronto!</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 500 }}>Assistente do Arquivo .env</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VITE_FIREBASE_API_KEY</label>
              <input type="text" className="input" placeholder="Ex: AIzaSyA1..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VITE_FIREBASE_AUTH_DOMAIN</label>
              <input type="text" className="input" placeholder="Ex: bar-do-getulio.firebaseapp.com" value={authDomain} onChange={e => setAuthDomain(e.target.value)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VITE_FIREBASE_PROJECT_ID</label>
              <input type="text" className="input" placeholder="Ex: bar-do-getulio" value={projectId} onChange={e => setProjectId(e.target.value)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VITE_FIREBASE_STORAGE_BUCKET</label>
              <input type="text" className="input" placeholder="Ex: bar-do-getulio.appspot.com" value={storageBucket} onChange={e => setStorageBucket(e.target.value)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VITE_FIREBASE_MESSAGING_SENDER_ID</label>
              <input type="text" className="input" placeholder="Ex: 8876543210" value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VITE_FIREBASE_APP_ID</label>
              <input type="text" className="input" placeholder="Ex: 1:8876:web:abcd" value={appId} onChange={e => setAppId(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(0,0,0,0.2)', 
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '1rem',
          position: 'relative',
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <FileText size={14} />
              Conteúdo gerado para o arquivo .env:
            </span>
            
            <button 
              onClick={handleCopyEnv} 
              className="btn btn-ghost" 
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {copied ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
          
          <pre style={{
            margin: 0,
            fontSize: '0.8rem',
            color: '#a7f3d0',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {envContent}
          </pre>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '0.75rem 1.5rem' }}>
            Fechar Assistente
          </button>
        </div>
      </div>
    </div>
  );
}
