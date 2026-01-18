import React from 'react';

export default function Translator(){
  const [text, setText] = React.useState('');
  const [result, setResult] = React.useState('');
  return (
    <div className="panel">
      <h2>Translator</h2>
      <div className="row">
        <textarea placeholder="Type text..." value={text} onChange={e=>setText(e.target.value)}></textarea>
      </div>
      <div className="row controls">
        <select><option>English</option></select>
        <select><option>Arabic</option></select>
        <button className="primary" onClick={()=>setResult('ترجمة توضيحية')}>Translate</button>
      </div>
      <div className="row">
        <div className="result">{result}</div>
      </div>
    </div>
  );
}