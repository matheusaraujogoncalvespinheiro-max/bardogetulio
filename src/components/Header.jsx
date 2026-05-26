import { Settings, History, LogOut, BarChart3 } from 'lucide-react';
import wolfLogo from '../assets/wolf_logo.png';

export default function Header({ onOpenCatalog, onOpenHistory, onOpenReport, onLogout, isConfigured, onOpenDbConfig }) {
  return (
    <header className="glass-panel" style={{ 
      margin: '1rem', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: '1rem',
      zIndex: 10,
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '0.15rem', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '52px',
          height: '52px'
        }}>
          <img src={wolfLogo} alt="Wolf Sistemas Gold" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Bar do Getúlio</h1>
            
            {isConfigured ? (
              <span style={{ 
                fontSize: '0.7rem', 
                color: '#4ade80', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                background: 'rgba(74, 222, 128, 0.1)',
                padding: '0.15rem 0.4rem',
                borderRadius: '12px',
                fontWeight: 500
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                Nuvem Ativa
              </span>
            ) : (
              <button 
                onClick={onOpenDbConfig} 
                style={{ 
                  fontSize: '0.7rem', 
                  color: '#fbbf24', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  background: 'rgba(251, 191, 36, 0.1)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  transition: 'background 0.2s'
                }} 
                title="Clique para configurar o Firebase"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }}></span>
                Modo Local (Configurar)
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sistema Wolf Gold</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={onOpenReport}>
          <BarChart3 size={20} />
          <span>Relatório</span>
        </button>
        <button className="btn btn-ghost" onClick={onOpenHistory}>
          <History size={20} />
          <span>Histórico</span>
        </button>
        <button className="btn btn-ghost" onClick={onOpenCatalog}>
          <Settings size={20} />
          <span>Catálogo</span>
        </button>
        <button className="btn btn-ghost" onClick={onLogout} style={{ color: 'var(--danger)' }}>
          <LogOut size={20} />
          <span className="hide-mobile">Sair</span>
        </button>
      </div>
    </header>
  );
}
