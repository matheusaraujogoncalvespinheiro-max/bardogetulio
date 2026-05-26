import { useState } from 'react';
import { Lock, User, LogIn } from 'lucide-react';
import wolfLogo from '../assets/wolf_logo.png';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '77079868300' && password === '2596') {
      onLogin();
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg-color)', zIndex: 1000 }}>
      <div className="glass-panel" style={{ 
        padding: '3rem 2rem', 
        width: '100%', 
        maxWidth: '400px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '1rem', 
            borderRadius: '24px',
            boxShadow: '0 8px 48px rgba(0, 0, 0, 0.4)',
            width: '120px',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '1px solid rgba(255,215,0,0.1)'
          }}>
            <img src={wolfLogo} alt="Wolf Sistemas Gold" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Bar do Getúlio</h1>
            <p style={{ color: 'var(--text-muted)' }}>Powered by Wolf Sistemas Gold</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Usuário</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Digite seu usuário" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="input" 
                placeholder="Digite sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}>
            <LogIn size={20} />
            <span>Entrar no Sistema</span>
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © 2024 Wolf Sistemas Gold - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
