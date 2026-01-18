import React from 'react';

export default function Home(){
  return (
    <div className="panel">
      <h1>Welcome to TranslaSite</h1>
      <p>A modern, fast, and friendly translator.</p>
      <div className="stats">
        <div className="stat"><strong>1.2K</strong><span>Translations</span></div>
        <div className="stat"><strong>300</strong><span>Active Users</span></div>
        <div className="stat"><strong>120</strong><span>Saved Words</span></div>
      </div>
    </div>
  );
}