// --- 1. Локализация (i18n) ---
const i18n = {
  ru: {
    searchPlaceholder: "Поиск в Google...",
    settingsTitle: "Настройки вида",
    settingsHeading: "Параметры оформления",
    langLabel: "Язык интерфейса",
    cardWidth: "Ширина баннера",
    cardHeight: "Высота баннера",
    fontSize: "Размер подписи",
    floorBlur: "Размытие пола",
    reflOpacity: "Яркость отражения",
    bgUrl: "URL Фоновой картинки",
    hoverOnlyTitle: "Показывать подпись только при ховере",
    hideAddBtn: "Скрыть кнопку добавления (+)",
    uiSound: "Включить звук UI (Web Audio)",
    btnDone: "Готово",
    shortcut: "Ярлык",
    editShortcut: "Редактировать ярлык",
    newShortcut: "Новый ярлык",
    labelTitle: "Название",
    labelSubtitle: "Подзаголовок",
    labelUrl: "Ссылка или файл",
    labelPoster: "URL постера",
    btnDelete: "Удалить",
    btnCancel: "Отмена",
    btnSave: "Сохранить",
    addText: "Добавить",
    defaultName: "Без названия",
    reflOff: "Откл"
  },
  en: {
    searchPlaceholder: "Search Google...",
    settingsTitle: "Appearance",
    settingsHeading: "Appearance Settings",
    langLabel: "Interface Language",
    cardWidth: "Banner Width",
    cardHeight: "Banner Height",
    fontSize: "Title Font Size",
    floorBlur: "Floor Reflection Blur",
    reflOpacity: "Reflection Brightness",
    bgUrl: "Background Image URL",
    hoverOnlyTitle: "Show title on hover only",
    hideAddBtn: "Hide Add (+) button",
    uiSound: "Enable UI Sound (Web Audio)",
    btnDone: "Done",
    shortcut: "Shortcut",
    editShortcut: "Edit Shortcut",
    newShortcut: "New Shortcut",
    labelTitle: "Title",
    labelSubtitle: "Subtitle",
    labelUrl: "Link or Local File",
    labelPoster: "Poster URL",
    btnDelete: "Delete",
    btnCancel: "Cancel",
    btnSave: "Save",
    addText: "Add",
    defaultName: "Untitled",
    reflOff: "Off"
  },
  pt: {
    searchPlaceholder: "Pesquisar no Google...",
    settingsTitle: "Aparência",
    settingsHeading: "Configurações Visuais",
    langLabel: "Idioma da Interface",
    cardWidth: "Largura do Banner",
    cardHeight: "Altura do Banner",
    fontSize: "Tamanho do Texto",
    floorBlur: "Desfoque do Reflexo",
    reflOpacity: "Brilho do Reflexo",
    bgUrl: "URL da Imagem de Fundo",
    hoverOnlyTitle: "Exibir legenda somente ao passar o mouse",
    hideAddBtn: "Ocultar botão Adicionar (+)",
    uiSound: "Ativar sons da interface (Web Audio)",
    btnDone: "Concluído",
    shortcut: "Atalho",
    editShortcut: "Editar Atalho",
    newShortcut: "Novo Atalho",
    labelTitle: "Título",
    labelSubtitle: "Subtítulo",
    labelUrl: "Link ou Arquivo Local",
    labelPoster: "URL do Poster",
    btnDelete: "Excluir",
    btnCancel: "Cancelar",
    btnSave: "Salvar",
    addText: "Adicionar",
    defaultName: "Sem título",
    reflOff: "Desat."
  },
  es: {
    searchPlaceholder: "Buscar en Google...",
    settingsTitle: "Apariencia",
    settingsHeading: "Configuración Visual",
    langLabel: "Idioma de la Interfaz",
    cardWidth: "Ancho del Banner",
    cardHeight: "Alto del Banner",
    fontSize: "Tamaño del Texto",
    floorBlur: "Desenfoque del Reflejo",
    reflOpacity: "Brillo del Reflejo",
    bgUrl: "URL de Fondo",
    hoverOnlyTitle: "Mostrar título sólo al pasar el cursor",
    hideAddBtn: "Ocultar botón Añadir (+)",
    uiSound: "Activar sonido de UI (Web Audio)",
    btnDone: "Listo",
    shortcut: "Acceso Directo",
    editShortcut: "Editar Acceso Directo",
    newShortcut: "Nuevo Acceso Directo",
    labelTitle: "Título",
    labelSubtitle: "Subtítulo",
    labelUrl: "Enlace o Archivo Local",
    labelPoster: "URL del Póster",
    btnDelete: "Eliminar",
    btnCancel: "Cancelar",
    btnSave: "Guardar",
    addText: "Añadir",
    defaultName: "Sin título",
    reflOff: "Desact."
  }
};

function applyLanguage(lang) {
  const dict = i18n[lang] || i18n.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  const searchInput = document.getElementById('searchInput');
  if (searchInput && dict.searchPlaceholder) {
    searchInput.placeholder = dict.searchPlaceholder;
  }
}

// --- 2. Web Audio FX ---
const AudioEngine = {
  ctx: null,
  enabled: false,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  playHover() {
    if (!this.enabled) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  },
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }
};

// --- 3. Часы ---
function updateClock() {
  const d = new Date();
  document.getElementById('clock').textContent = 
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- 4. Настройки оформления ---
const defaultSettings = {
  lang: 'ru',
  width: 160,
  height: 230,
  fontSize: 0.9,
  blur: 4,
  opacity: 45,
  bg: '',
  hoverOnlyTitle: false,
  hideAdd: false,
  sound: false
};

let userSettings = JSON.parse(localStorage.getItem('my_newtab_settings')) || defaultSettings;

const opacityVal = document.getElementById('opacityVal');
const widthVal = document.getElementById('widthVal');
const heightVal = document.getElementById('heightVal');
const fontVal = document.getElementById('fontVal');
const blurVal = document.getElementById('blurVal');

function applyVisualSettings() {
  const r = document.documentElement;
  const dict = i18n[userSettings.lang || 'ru'] || i18n.en;
  const op = parseInt(userSettings.opacity, 10);

  if (op === 0) {
    document.body.classList.add('no-reflection');
    r.style.setProperty('--refl-opacity', '0');
    if (opacityVal) opacityVal.textContent = dict.reflOff;
  } else {
    document.body.classList.remove('no-reflection');
    r.style.setProperty('--refl-opacity', (op / 100).toString());
    if (opacityVal) opacityVal.textContent = `${op}%`;
  }

  r.style.setProperty('--refl-blur', `${userSettings.blur}px`);
  r.style.setProperty('--card-w', `${userSettings.width}px`);
  r.style.setProperty('--card-h', `${userSettings.height}px`);
  r.style.setProperty('--font-size', `${userSettings.fontSize}rem`);
  r.style.setProperty('--sub-size', `${Math.max(0.65, userSettings.fontSize * 0.8)}rem`);

  if (userSettings.hoverOnlyTitle) document.body.classList.add('hover-only-title');
  else document.body.classList.remove('hover-only-title');

  if (userSettings.bg && userSettings.bg.trim() !== '') {
    r.style.setProperty('--custom-bg', `linear-gradient(rgba(7,9,14,0.7), rgba(7,9,14,0.85)), url('${userSettings.bg.trim()}')`);
  } else {
    r.style.setProperty('--custom-bg', 'none');
  }

  AudioEngine.enabled = !!userSettings.sound;
  applyLanguage(userSettings.lang || 'ru');
}

// --- 5. Карточки ---
const defaultCards = [
  {
    title: "GitHub",
    subtitle: "Repositories",
    url: "https://github.com",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "YouTube",
    subtitle: "Media",
    url: "https://youtube.com",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "Dev Server",
    subtitle: "Local HTML",
    url: "D:/Projects/Site/index.html",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80"
  },
  {
    title: "AI Tools",
    subtitle: "Prompts",
    url: "https://chatgpt.com",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80"
  }
];

let cards = JSON.parse(localStorage.getItem('my_newtab_cards')) || defaultCards;
let editIndex = null;
let draggedIndex = null;
let isDragging = false;

function openLink(url) {
  AudioEngine.playClick();
  const isLocal = /^[a-zA-Z]:[\\/]/.test(url) || url.startsWith('file:///');

  if (isLocal) {
    const formatted = url.replace(/\\/g, '/');
    const fileUrl = formatted.startsWith('file:///') ? formatted : `file:///${formatted}`;
    if (window.chrome && chrome.tabs && chrome.tabs.update) {
      chrome.tabs.update({ url: fileUrl });
      return;
    }
    window.location.href = fileUrl;
    return;
  }

  window.location.href = url;
}

const deck = document.getElementById('cardDeck');

function renderCards() {
  deck.innerHTML = '';
  const dict = i18n[userSettings.lang || 'ru'] || i18n.en;

  cards.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'card-wrap';
    wrap.setAttribute('draggable', 'true');
    wrap.dataset.index = idx;

    const imgSrc = item.image || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500';

    wrap.innerHTML = `
      <div class="card">
        <img src="${imgSrc}" alt="${item.title}">
        <div class="overlay">
          <div class="title">${item.title}</div>
          <div class="subtitle">${item.subtitle || ''}</div>
        </div>
        <div class="card-edit-btn" title="Edit">⚙</div>
      </div>
      <div class="reflection"><img src="${imgSrc}" alt="reflection"></div>
    `;

    wrap.addEventListener('dragstart', (e) => {
      isDragging = true;
      draggedIndex = idx;
      wrap.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', idx);
    });

    wrap.addEventListener('dragend', () => {
      wrap.classList.remove('dragging');
      document.querySelectorAll('.card-wrap').forEach(w => w.classList.remove('drag-over'));
      setTimeout(() => { isDragging = false; }, 50);
    });

    wrap.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedIndex !== idx) wrap.classList.add('drag-over');
    });

    wrap.addEventListener('dragleave', () => wrap.classList.remove('drag-over'));

    wrap.addEventListener('drop', (e) => {
      e.preventDefault();
      wrap.classList.remove('drag-over');
      const targetIndex = idx;
      if (draggedIndex !== null && draggedIndex !== targetIndex) {
        const movedItem = cards.splice(draggedIndex, 1)[0];
        cards.splice(targetIndex, 0, movedItem);
        localStorage.setItem('my_newtab_cards', JSON.stringify(cards));
        renderCards();
        AudioEngine.playClick();
      }
    });

    wrap.addEventListener('mouseenter', () => AudioEngine.playHover());

    wrap.querySelector('.card-edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.playClick();
      showCardModal(idx);
    });

    wrap.querySelector('.card').addEventListener('click', () => {
      if (isDragging) return;
      openLink(item.url);
    });

    deck.appendChild(wrap);
  });

  if (!userSettings.hideAdd) {
    const addWrap = document.createElement('div');
    addWrap.className = 'card-wrap';
    addWrap.innerHTML = `
      <div class="card card-add">
        <span class="plus-icon">+</span>
        <span>${dict.addText || 'Добавить'}</span>
      </div>
    `;
    addWrap.addEventListener('mouseenter', () => AudioEngine.playHover());
    addWrap.querySelector('.card-add').addEventListener('click', () => {
      AudioEngine.playClick();
      showCardModal(null);
    });
    deck.appendChild(addWrap);
  }
}

// --- 6. Модалка карточки ---
const cardModal = document.getElementById('cardModal');
const inputTitle = document.getElementById('inputTitle');
const inputSubtitle = document.getElementById('inputSubtitle');
const inputUrl = document.getElementById('inputUrl');
const inputImage = document.getElementById('inputImage');
const btnDelete = document.getElementById('btnDelete');
const cardModalTitle = document.getElementById('cardModalTitle');

function showCardModal(idx) {
  editIndex = idx;
  const dict = i18n[userSettings.lang || 'ru'] || i18n.en;

  if (idx !== null) {
    const c = cards[idx];
    cardModalTitle.textContent = dict.editShortcut;
    inputTitle.value = c.title || '';
    inputSubtitle.value = c.subtitle || '';
    inputUrl.value = c.url || '';
    inputImage.value = c.image || '';
    btnDelete.style.display = "block";
  } else {
    cardModalTitle.textContent = dict.newShortcut;
    inputTitle.value = ''; inputSubtitle.value = ''; inputUrl.value = ''; inputImage.value = '';
    btnDelete.style.display = "none";
  }
  cardModal.style.display = "flex";
  inputTitle.focus();
}

document.getElementById('btnCardCancel').addEventListener('click', () => {
  AudioEngine.playClick();
  cardModal.style.display = "none";
});

document.getElementById('btnCardSave').addEventListener('click', () => {
  AudioEngine.playClick();
  const dict = i18n[userSettings.lang || 'ru'] || i18n.en;
  const itemData = {
    title: inputTitle.value.trim() || dict.defaultName,
    subtitle: inputSubtitle.value.trim(),
    url: inputUrl.value.trim() || '#',
    image: inputImage.value.trim()
  };
  if (editIndex !== null) cards[editIndex] = itemData;
  else cards.push(itemData);
  localStorage.setItem('my_newtab_cards', JSON.stringify(cards));
  renderCards();
  cardModal.style.display = "none";
});

btnDelete.addEventListener('click', () => {
  AudioEngine.playClick();
  if (editIndex !== null) {
    cards.splice(editIndex, 1);
    localStorage.setItem('my_newtab_cards', JSON.stringify(cards));
    renderCards();
    cardModal.style.display = "none";
  }
});

// --- 7. Настройки вида ---
const settingsModal = document.getElementById('settingsModal');
const sLang = document.getElementById('settingLang');
const sWidth = document.getElementById('settingWidth');
const sHeight = document.getElementById('settingHeight');
const sFont = document.getElementById('settingFont');
const sBlur = document.getElementById('settingBlur');
const sOpacity = document.getElementById('settingOpacity');
const sBg = document.getElementById('settingBg');
const sHoverTitle = document.getElementById('settingHoverTitle');
const sHideAdd = document.getElementById('settingHideAdd');
const sSound = document.getElementById('settingSound');

document.getElementById('openSettingsBtn').addEventListener('click', () => {
  AudioEngine.playClick();
  const dict = i18n[userSettings.lang || 'ru'] || i18n.en;

  sLang.value = userSettings.lang || 'ru';
  sWidth.value = userSettings.width;
  sHeight.value = userSettings.height;
  sFont.value = userSettings.fontSize;
  sBlur.value = userSettings.blur;
  sOpacity.value = userSettings.opacity;
  sBg.value = userSettings.bg || '';
  sHoverTitle.checked = !!userSettings.hoverOnlyTitle;
  sHideAdd.checked = !!userSettings.hideAdd;
  sSound.checked = !!userSettings.sound;

  widthVal.textContent = `${userSettings.width}px`;
  heightVal.textContent = `${userSettings.height}px`;
  fontVal.textContent = `${userSettings.fontSize}rem`;
  blurVal.textContent = `${userSettings.blur}px`;
  opacityVal.textContent = (parseInt(userSettings.opacity, 10) === 0) ? dict.reflOff : `${userSettings.opacity}%`;

  settingsModal.style.display = "flex";
});

sLang.addEventListener('change', (e) => {
  userSettings.lang = e.target.value;
  applyLanguage(e.target.value);
  renderCards();
});

sWidth.addEventListener('input', (e) => {
  userSettings.width = e.target.value;
  widthVal.textContent = `${e.target.value}px`;
  applyVisualSettings();
});

sHeight.addEventListener('input', (e) => {
  userSettings.height = e.target.value;
  heightVal.textContent = `${e.target.value}px`;
  applyVisualSettings();
});

sFont.addEventListener('input', (e) => {
  userSettings.fontSize = e.target.value;
  fontVal.textContent = `${e.target.value}rem`;
  applyVisualSettings();
});

sBlur.addEventListener('input', (e) => {
  userSettings.blur = e.target.value;
  blurVal.textContent = `${e.target.value}px`;
  applyVisualSettings();
});

sOpacity.addEventListener('input', (e) => {
  userSettings.opacity = e.target.value;
  applyVisualSettings();
});

sBg.addEventListener('input', (e) => {
  userSettings.bg = e.target.value;
  applyVisualSettings();
});

sHoverTitle.addEventListener('change', (e) => {
  userSettings.hoverOnlyTitle = e.target.checked;
  applyVisualSettings();
});

sHideAdd.addEventListener('change', (e) => {
  userSettings.hideAdd = e.target.checked;
  renderCards();
});

sSound.addEventListener('change', (e) => {
  userSettings.sound = e.target.checked;
  AudioEngine.enabled = e.target.checked;
  if (e.target.checked) AudioEngine.playClick();
});

function closeSettings() {
  AudioEngine.playClick();
  localStorage.setItem('my_newtab_settings', JSON.stringify(userSettings));
  settingsModal.style.display = "none";
}

document.getElementById('btnSettingsClose').addEventListener('click', closeSettings);

window.addEventListener('click', (e) => {
  if (e.target === cardModal) cardModal.style.display = "none";
  if (e.target === settingsModal) closeSettings();
});

// Инициализация при старте
applyVisualSettings();
renderCards();