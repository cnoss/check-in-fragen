const $ = (id) => document.getElementById(id);

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

let data = { tags: [], stacks: [] };
let activeTag = store.get('tag', null);
let deck = { titel: '', original: [], fragen: [], index: 0 };
let wakeLock = null;

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function visibleStacks() {
  return activeTag ? data.stacks.filter((s) => s.tags.includes(activeTag)) : data.stacks;
}

/* ---------- Übersicht ---------- */

function renderList() {
  const tags = $('tags');
  tags.innerHTML = '';
  for (const tag of [null, ...data.tags]) {
    const btn = document.createElement('button');
    btn.textContent = tag ?? 'Alle';
    btn.setAttribute('aria-pressed', String(tag === activeTag));
    btn.onclick = () => {
      activeTag = tag;
      store.set('tag', tag);
      renderList();
    };
    tags.append(btn);
  }

  const list = $('stacks');
  list.innerHTML = '';
  const stacks = visibleStacks().filter((s) => s.fragen.length);
  if (!stacks.length) {
    list.innerHTML = '<li class="empty">Keine Stacks für diesen Filter.</li>';
  }
  for (const s of stacks) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#/stack/${s.slug}`;
    a.innerHTML = '<div class="head"><strong></strong><span class="count"></span></div><p></p>';
    a.querySelector('strong').textContent = s.titel;
    a.querySelector('.count').textContent = `${s.fragen.length} ${s.fragen.length === 1 ? 'Frage' : 'Fragen'}`;
    a.querySelector('p').textContent = s.beschreibung;
    li.append(a);
    list.append(li);
  }
}

/* ---------- Karten ---------- */

function openDeck(titel, fragen, forceShuffle = false) {
  deck = { titel, original: fragen, fragen, index: 0, forceShuffle };
  $('cards-title').textContent = titel;
  $('shuffle').checked = forceShuffle || store.get('shuffle', false);
  $('shuffle').disabled = forceShuffle;
  applyShuffle();
}

function applyShuffle() {
  deck.fragen = $('shuffle').checked ? shuffle(deck.original) : deck.original;
  deck.index = 0;
  renderCard();
}

function renderCard() {
  const n = deck.fragen.length;
  $('card-text').textContent = n ? deck.fragen[deck.index] : 'Hier sind noch keine Fragen.';
  $('counter').textContent = n ? `${deck.index + 1} / ${n}` : '';
  $('prev').disabled = deck.index <= 0;
  $('next').disabled = deck.index >= n - 1;
}

function go(step) {
  const target = deck.index + step;
  if (target < 0 || target >= deck.fragen.length) return bounce();

  const card = $('card');
  card.classList.add('animate');
  card.style.transform = `translateX(${step > 0 ? -110 : 110}%)`;
  card.style.opacity = '0';
  setTimeout(() => {
    deck.index = target;
    renderCard();
    card.classList.remove('animate');
    card.style.transform = `translateX(${step > 0 ? 110 : -110}%)`;
    requestAnimationFrame(() => {
      card.classList.add('animate');
      card.style.transform = '';
      card.style.opacity = '';
    });
  }, 180);
}

function bounce() {
  const card = $('card');
  card.classList.add('animate');
  card.style.transform = '';
}

function setupSwipe() {
  const card = $('card');
  let startX = null;
  let dx = 0;

  $('deck').addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    dx = 0;
    card.classList.remove('animate');
  });
  window.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    dx = e.clientX - startX;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 40}deg)`;
  });
  window.addEventListener('pointerup', () => {
    if (startX === null) return;
    startX = null;
    if (dx < -60) go(1);
    else if (dx > 60) go(-1);
    else bounce();
  });
  window.addEventListener('pointercancel', () => { startX = null; bounce(); });
}

async function keepAwake(on) {
  try {
    if (on && !wakeLock && 'wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) {
      await wakeLock.release();
    }
  } catch {}
}

/* ---------- Routing ---------- */

function route() {
  const hash = location.hash;
  const stackMatch = hash.match(/^#\/stack\/(.+)$/);
  const inCards = Boolean(stackMatch) || hash === '#/zufall';

  if (stackMatch) {
    const stack = data.stacks.find((s) => s.slug === decodeURIComponent(stackMatch[1]));
    if (!stack) return (location.hash = '#/');
    openDeck(stack.titel, stack.fragen);
  } else if (hash === '#/zufall') {
    openDeck(activeTag ? `Zufall · ${activeTag}` : 'Zufall', visibleStacks().flatMap((s) => s.fragen), true);
  } else {
    renderList();
  }

  $('view-list').hidden = inCards;
  $('view-cards').hidden = !inCards;
  keepAwake(inCards);
  window.scrollTo(0, 0);
}

/* ---------- Start ---------- */

$('random').onclick = () => (location.hash = '#/zufall');
$('prev').onclick = () => go(-1);
$('next').onclick = () => go(1);
$('shuffle').onchange = () => {
  store.set('shuffle', $('shuffle').checked);
  applyShuffle();
};
document.addEventListener('keydown', (e) => {
  if ($('view-cards').hidden) return;
  if (e.key === 'ArrowRight') go(1);
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'Escape') location.hash = '#/';
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') keepAwake(!$('view-cards').hidden);
});
window.addEventListener('hashchange', route);
setupSwipe();

function readData() {
  const tpl = $('data');
  const split = (s) => (s ? s.split(',') : []);
  return {
    tags: split(tpl.dataset.tags),
    stacks: [...tpl.content.querySelectorAll('section')].map((el) => ({
      slug: el.dataset.slug,
      titel: el.dataset.titel,
      beschreibung: el.dataset.beschreibung,
      tags: split(el.dataset.tags),
      fragen: [...el.querySelectorAll('li')].map((li) => li.textContent.trim()).filter(Boolean),
    })),
  };
}

data = readData();
if (activeTag && !data.tags.includes(activeTag)) activeTag = null;
route();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
