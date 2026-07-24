import { describe, it, expect } from 'vitest';
import { addHabit, toggleDay, computeStreak, completionRate } from '../src/habits.js';

describe('addHabit', () => {
  it('adiciona um hábito com nome', () => {
    const r = addHabit([], 'Beber água');
    expect(r).toHaveLength(1);
    expect(r[0].name).toBe('Beber água');
  });
  it('ignora nome vazio ou só espaços', () => {
    expect(addHabit([], '   ')).toHaveLength(0);
  });
});

describe('toggleDay', () => {
  it('marca e depois desmarca o mesmo dia', () => {
    let h = addHabit([], 'Ler');
    const id = h[0].id;
    h = toggleDay(h, id, '2026-01-10');
    expect(h[0].done).toContain('2026-01-10');
    h = toggleDay(h, id, '2026-01-10');
    expect(h[0].done).not.toContain('2026-01-10');
  });
});

describe('computeStreak', () => {
  it('conta dias consecutivos terminando hoje', () => {
    const habit = { id: '1', name: 'x', done: ['2026-01-08', '2026-01-09', '2026-01-10'] };
    expect(computeStreak(habit, '2026-01-10')).toBe(3);
  });
  it('mantém a sequência viva se ontem foi feito mas hoje ainda não', () => {
    const habit = { id: '1', name: 'x', done: ['2026-01-08', '2026-01-09'] };
    expect(computeStreak(habit, '2026-01-10')).toBe(2);
  });
  it('retorna 0 quando não há registros', () => {
    expect(computeStreak({ id: '1', name: 'x', done: [] }, '2026-01-10')).toBe(0);
  });
});

describe('completionRate', () => {
  it('calcula a porcentagem concluída no dia', () => {
    let h = addHabit(addHabit([], 'a'), 'b');
    h = toggleDay(h, h[0].id, '2026-01-10');
    expect(completionRate(h, '2026-01-10')).toBe(50);
  });
});
