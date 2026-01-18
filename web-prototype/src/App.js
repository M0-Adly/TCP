import React from 'react';
import './styles.css';
import Home from './components/Home';
import Translator from './components/Translator';
import Library from './components/Library';
import Dashboard from './components/Dashboard';

export default function App() {
  const [route, setRoute] = React.useState('home');
  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">TranslaSite</div>
        <nav>
          <button onClick={() => setRoute('home')}>Home</button>
          <button onClick={() => setRoute('translator')}>Translator</button>
          <button onClick={() => setRoute('library')}>Library</button>
          <button onClick={() => setRoute('dashboard')}>Dashboard</button>
        </nav>
      </header>
      <main className="content">
        {route === 'home' && <Home />}
        {route === 'translator' && <Translator />}
        {route === 'library' && <Library />}
        {route === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}