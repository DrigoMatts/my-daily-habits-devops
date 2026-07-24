// Lógica pura de hábitos: sem DOM, sem React, sem data global.
// É "pura" de propósito -> fácil de testar no CI (é o que o Vitest cobre).

function uid() {
  return (globalThis.crypto && globalThis.crypto.randomUUID && globalThis.crypto.randomUUID())
    || ('h_' + Math.random().toString(36).slice(2) + Date.now().toString(36));
}

export function addHabit(habits, name) {
  const nome = (name || '').trim();
  if (!nome) return habits;                       // ignora nome vazio
  return [...habits, { id: uid(), name: nome, done: [] }];
}

export function toggleDay(habits, id, dayISO) {
  return habits.map((h) => {
    if (h.id !== id) return h;
    const done = h.done.includes(dayISO)
      ? h.done.filter((d) => d !== dayISO)         // desmarca
      : [...h.done, dayISO];                        // marca
    return { ...h, done };
  });
}

// Dias consecutivos terminando hoje. Se hoje ainda não foi feito,
// a sequência ainda pode estar viva contada a partir de ontem.
export function computeStreak(habit, todayISO) {
  const set = new Set(habit.done);
  let cursor = new Date(todayISO + 'T00:00:00Z');   // UTC -> sem susto de fuso
  if (!set.has(iso(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  let streak = 0;
  while (set.has(iso(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function completionRate(habits, dayISO) {
  if (habits.length === 0) return 0;
  const feitos = habits.filter((h) => h.done.includes(dayISO)).length;
  return Math.round((feitos / habits.length) * 100);
}

function iso(date) {
  return date.toISOString().slice(0, 10);
}
