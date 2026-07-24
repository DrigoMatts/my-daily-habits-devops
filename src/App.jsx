import React, { useState, useEffect } from 'react';
import { addHabit, toggleDay, computeStreak, completionRate } from './habits.js';

const STORAGE_KEY = 'projeto-curso-habitos';

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function App() {
  const hoje = todayISO();
  const [habits, setHabits] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [nome, setNome] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  return (
    <main className="app">
      <header>
        <h1>Meus Hábitos</h1>
        <p className="sub">Hoje: {hoje} · {completionRate(habits, hoje)}% concluído</p>
      </header>

      <div className="add">
        <input
          value={nome}
          placeholder="Novo hábito (ex: Estudar DevOps)"
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { setHabits(addHabit(habits, nome)); setNome(''); } }}
        />
        <button onClick={() => { setHabits(addHabit(habits, nome)); setNome(''); }}>Adicionar</button>
      </div>

      <ul className="list">
        {habits.length === 0 && <li className="empty">Nenhum hábito ainda. Adicione o primeiro!</li>}
        {habits.map((h) => {
          const feitoHoje = h.done.includes(hoje);
          return (
            <li key={h.id} className={feitoHoje ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={feitoHoje} onChange={() => setHabits(toggleDay(habits, h.id, hoje))} />
                <span className="name">{h.name}</span>
              </label>
              <span className="streak">🔥 {computeStreak(h, hoje)}d</span>
              <button className="del" onClick={() => setHabits(habits.filter((x) => x.id !== h.id))}>×</button>
            </li>
          );
        })}
      </ul>

      <footer>Módulo 11 — DevOps &amp; Cloud · dados salvos no navegador</footer>
    </main>
  );
}
