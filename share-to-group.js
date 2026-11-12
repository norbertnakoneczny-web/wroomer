/*!
 * WROOMER.PL — „Udostępnij w grupie” (prototyp, v1.0.0)
 * -----------------------------------------------------
 * Zero zależności. Nie modyfikuje niczego poza:
 *   - elementami oznaczonymi [data-wroomer-share] (i tym, co sam tworzy),
 *   - namespace window.WroomerShare,
 *   - wpisem w localStorage (klucz konfigurowalny).
 * Nie nadpisuje window.gtag — tylko go woła, jeśli istnieje.
 *
 * Użycie:
 *   <script src="/share-to-group.js"></script>
 *   <div data-wroomer-share
 *        data-listing='{"id":"...","title":"...","year":2005,"price":17500,
 *                       "location":"Gorzyce","url":"/auto/...","image":"https://...",
 *                       "description":"..."}'></div>
 */
(function (global) {
  'use strict';

  if (global.WroomerShare && global.WroomerShare.version) return;

  var VERSION = '1.0.0';

  var DEFAULTS = {
    groupUrl: 'https://www.facebook.com/groups/4172603326203446',
    siteUrl: 'https://www.wroomer.pl',
    utmSource: 'facebook',
    utmMedium: 'group',
    utmCampaign: 'listing_share',
    role: 'seller',            // 'seller' | 'admin'
    throttleHours: 24,         // 0 = wyłączone
    storageKey: 'wroomer_share_v1',
    endpoint: null,            // opcjonalny POST, np. '/api/social/mark'
    onEvent: null,             // opcjonalny callback (eventName, payload)
    mountTargets: '[data-wroomer-share]'
  };

  var config = assign({}, DEFAULTS);

  /* ------------------------------- utils ------------------------------- */

  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (!src) continue;
      for (var key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) target[key] = src[key];
      }
    }
    return target;
  }

  function trimSlash(value) {
    return String(value || '').replace(/\/+$/, '');
  }

  function formatPrice(value) {
    var n = Number(String(value == null ? '' : value).replace(/[^\d.]/g, ''));
    if (!isFinite(n) || n <= 0) return '';
    try {
      return n.toLocaleString('pl-PL');
    } catch (err) {
      return String(Math.round(n));
    }
  }

  function stripDiacritics(value) {
    return String(value || '')
      .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
      .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
      .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
      .replace(/Ą/g, 'A').replace(/Ć/g, 'C').replace(/Ę/g, 'E')
      .replace(/Ł/g, 'L').replace(/Ń/g, 'N').replace(/Ó/g, 'O')
      .replace(/Ś/g, 'S').replace(/Ź/g, 'Z').replace(/Ż/g, 'Z');
  }

  function hashtag(value) {
    var clean = stripDiacritics(value)
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 32);
    return clean ? '#' + clean : '';
  }

  function cityOf(listing) {
    var raw = String(listing.location || listing.lokalizacja || '').trim();
    if (!raw) return '';
    var parts = raw.split(',').map(function (part) { return part.trim(); }).filter(Boolean);
    var first = parts[0] || '';
    if (/^ul\.?/i.test(first) && parts[1]) first = parts[1];
    return first.replace(/^\d{2}-\d{3}\s*/, '').replace(/\.$/, '').trim();
  }

  function shortDescription(text, max) {
    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    if (clean.length <= max) return clean;
    var cut = clean.slice(0, max);
    var lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > max * 0.6) cut = cut.slice(0, lastSpace);
    return cut.replace(/[.,;:!?-]+$/, '') + '…';
  }

  function absoluteUrl(url) {
    var value = String(url || '').trim();
    if (!value) return trimSlash(config.siteUrl) + '/';
    if (/^https?:\/\//i.test(value)) return value;
    return trimSlash(config.siteUrl) + (value.charAt(0) === '/' ? '' : '/') + value;
  }

  function withUtm(url, role) {
    var target = absoluteUrl(url);
    var params = [
      'utm_source=' + encodeURIComponent(config.utmSource),
      'utm_medium=' + encodeURIComponent(config.utmMedium),
      'utm_campaign=' + encodeURIComponent(config.utmCampaign),
      'utm_content=' + encodeURIComponent(role || config.role)
    ].join('&');
    var hash = '';
    var hashIndex = target.indexOf('#');
    if (hashIndex !== -1) {
      hash = target.slice(hashIndex);
      target = target.slice(0, hashIndex);
    }
    return target + (target.indexOf('?') === -1 ? '?' : '&') + params + hash;
  }

  function track(eventName, payload) {
    var data = assign({ role: config.role, event_category: 'share_to_group' }, payload || {});
    try {
      if (typeof global.gtag === 'function') global.gtag('event', eventName, data);
      if (typeof config.onEvent === 'function') config.onEvent(eventName, data);
    } catch (err) { /* śledzenie nigdy nie może wywalić UI */ }
  }

  /* ------------------------------ storage ------------------------------ */

  function readStore() {
    try {
      var raw = global.localStorage.getItem(config.storageKey);
      var parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function writeStore(store) {
    try {
      global.localStorage.setItem(config.storageKey, JSON.stringify(store));
    } catch (err) { /* tryb prywatny / brak miejsca — ignorujemy */ }
  }

  function listingKey(listing) {
    return String(listing.id || listing.slug || listing.url || listing.title || 'unknown');
  }

  function getStatus(listing) {
    var entry = readStore()[listingKey(listing)] || null;
    if (!entry) return null;
    var ageMs = Date.now() - Number(entry.publishedAt || 0);
    return {
      publishedAt: entry.publishedAt ? new Date(entry.publishedAt) : null,
      publishedBy: entry.publishedBy || 'seller',
      count: Number(entry.count || 1),
      recent: ageMs >= 0 && ageMs < Number(config.throttleHours) * 3600 * 1000
    };
  }

  function markPublished(listing, role) {
    var store = readStore();
    var key = listingKey(listing);
    var previous = store[key] || {};
    store[key] = {
      publishedAt: Date.now(),
      publishedBy: role || config.role,
      count: Number(previous.count || 0) + 1
    };
    writeStore(store);

    if (config.endpoint) {
      try {
        var body = JSON.stringify({
          listing_id: listing.id || null,
          channel: 'facebook_group',
          status: 'published',
          shared_by: role || config.role
        });
        if (global.fetch) {
          global.fetch(config.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
            keepalive: true
          }).catch(function () { /* cicho — status lokalny już zapisany */ });
        }
      } catch (err) { /* ignorujemy */ }
    }
    return getStatus(listing);
  }

  /* ------------------------------ actions ------------------------------ */

  function buildPostText(listing, options) {
    var opts = options || {};
    var role = opts.role || config.role;
    var title = String(listing.title || [listing.marka, listing.model].filter(Boolean).join(' ') || 'Samochód').trim();
    var year = listing.year ? String(listing.year) : '';
    var price = formatPrice(listing.price != null ? listing.price : listing.cena);
    var city = cityOf(listing);

    var head = title;
    if (year && head.indexOf(year) === -1) head += ' • ' + year;
    if (price) head += ' • ' + price + ' zł';
    if (city) head += ' • ' + city;

    var lines = ['🚗 ' + head];

    var detailBits = [];
    if (listing.mileage) detailBits.push(formatPrice(listing.mileage) + ' km');
    if (listing.fuel) detailBits.push(String(listing.fuel));
    if (listing.gear) detailBits.push(String(listing.gear));
    if (detailBits.length) lines.push(detailBits.join(', '));

    var desc = shortDescription(listing.description || listing.opis, 180);
    if (desc) {
      lines.push('');
      lines.push(desc);
    }

    lines.push('');
    lines.push('➡️ Szczegóły i zdjęcia: ' + withUtm(listing.url, role));
    lines.push('');

    var tags = [];
    var cityTag = hashtag(city);
    if (cityTag) tags.push(cityTag);
    tags.push('#Śląsk', '#autaużywane');
    lines.push(tags.join(' '));

    return lines.join('\n');
  }

  function legacyCopy(text) {
    try {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(area);
      return !!ok;
    } catch (err) {
      return false;
    }
  }

  function copyText(text) {
    if (global.navigator && global.navigator.clipboard && global.isSecureContext) {
      return global.navigator.clipboard.writeText(text)
        .then(function () { return true; })
        .catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function openGroup() {
    var win = global.open(config.groupUrl, '_blank', 'noopener,noreferrer');
    if (!win) global.location.href = config.groupUrl;
  }

  function fileNameFor(listing, ext) {
    var base = String(listing.slug || listing.id || 'ogloszenie')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'ogloszenie';
    return 'wroomer-' + base + '.' + (ext || 'jpg');
  }

  // Konwersja do JPEG: Facebook pewniej przyjmuje JPEG niż WebP,
  // a przy okazji re-encode przez canvas usuwa EXIF/GPS ze zdjęcia.
  function blobToJpeg(blob, maxSize) {
    return new Promise(function (resolve, reject) {
      if (!global.URL || !global.URL.createObjectURL) return reject(new Error('brak-URL'));
      var objectUrl = global.URL.createObjectURL(blob);
      var image = new global.Image();

      function cleanup() {
        try { global.URL.revokeObjectURL(objectUrl); } catch (err) { /* ignorujemy */ }
      }

      image.onload = function () {
        try {
          var width = image.naturalWidth || image.width;
          var height = image.naturalHeight || image.height;
          var scale = Math.min(1, (maxSize || 1600) / Math.max(width, height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(width * scale));
          canvas.height = Math.max(1, Math.round(height * scale));
          var ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('brak-canvas');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(function (out) {
            cleanup();
            if (out) resolve(out); else reject(new Error('brak-bloba'));
          }, 'image/jpeg', 0.9);
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      image.onerror = function () {
        cleanup();
        reject(new Error('nie-odczytano-obrazu'));
      };

      image.src = objectUrl;
    });
  }

  function saveBlob(blob, fileName) {
    var objectUrl = global.URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    global.setTimeout(function () {
      try { global.URL.revokeObjectURL(objectUrl); } catch (err) { /* ignorujemy */ }
    }, 4000);
  }

  function downloadImage(listing) {
    var url = listing.image || listing.photo || (listing.images && listing.images[0]) || '';
    if (!url) return Promise.resolve({ ok: false, reason: 'brak-zdjecia' });

    if (!global.fetch || !global.URL || !global.URL.createObjectURL) {
      global.open(url, '_blank', 'noopener');
      return Promise.resolve({ ok: false, reason: 'otwarto-w-karcie' });
    }

    return global.fetch(url, { mode: 'cors', credentials: 'omit' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.blob();
      })
      .then(function (blob) {
        return blobToJpeg(blob, 1600)
          .then(function (jpeg) {
            var name = fileNameFor(listing, 'jpg');
            saveBlob(jpeg, name);
            return { ok: true, fileName: name, converted: true };
          })
          .catch(function () {
            // Gdy canvas nie zadziała, zapisujemy oryginał — lepszy WebP niż nic.
            var name = fileNameFor(listing, 'webp');
            saveBlob(blob, name);
            return { ok: true, fileName: name, converted: false };
          });
      })
      .catch(function () {
        global.open(url, '_blank', 'noopener');
        return { ok: false, reason: 'otwarto-w-karcie' };
      });
  }

  /* --------------------------------- UI -------------------------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function makeButton(label, variant) {
    var button = el('button', 'wsg__btn' + (variant ? ' wsg__btn--' + variant : ''), label);
    button.type = 'button';
    return button;
  }

  function setStatus(statusNode, message, tone) {
    statusNode.textContent = message;
    statusNode.setAttribute('data-tone', tone || 'neutral');
  }

  function renderPanel(listing, options) {
    var opts = assign({}, config, options || {});
    var role = opts.role || 'seller';
    var panel = el('section', 'wsg');
    panel.setAttribute('aria-label', 'Udostępnij ogłoszenie w grupie na Facebooku');

    var head = el('div', 'wsg__head');
    head.appendChild(el('h3', 'wsg__title', role === 'admin' ? 'Udostępnij w grupie (admin)' : 'Udostępnij w grupie i sprzedaj szybciej'));
    head.appendChild(el('p', 'wsg__hint', role === 'admin'
      ? 'Skopiuj tekst, pobierz zdjęcie i wklej post ręcznie w grupie. Jeden post na ogłoszenie.'
      : 'Wklej gotowy post w grupie — auto z linkiem dotrze do większej liczby kupujących.'));
    panel.appendChild(head);

    var steps = el('ol', 'wsg__steps');
    ['Skopiuj tekst', 'Otwórz grupę i wklej', 'Dodaj zdjęcie i opublikuj'].forEach(function (step) {
      steps.appendChild(el('li', null, step));
    });
    panel.appendChild(steps);

    var actions = el('div', 'wsg__actions');
    var copyBtn = makeButton('Kopiuj post', 'primary');
    var imageBtn = makeButton('Pobierz zdjęcie');
    var groupBtn = makeButton('Otwórz grupę');
    actions.appendChild(copyBtn);
    actions.appendChild(imageBtn);
    actions.appendChild(groupBtn);
    panel.appendChild(actions);

    var status = el('p', 'wsg__status');
    status.setAttribute('aria-live', 'polite');
    setStatus(status, 'Post zawiera link z oznaczeniem źródła — dzięki temu wiadomo, ile wejść przyszło z grupy.');
    panel.appendChild(status);

    var doneRow = el('div', 'wsg__done-row');
    var doneBtn = makeButton('Opublikowałem', 'ghost');
    doneRow.appendChild(doneBtn);
    panel.appendChild(doneRow);

    var note = el('p', 'wsg__note');
    panel.appendChild(note);

    function refreshNote() {
      var state = getStatus(listing);
      if (!state) {
        note.textContent = '';
        return;
      }
      var when = state.publishedAt ? state.publishedAt.toLocaleString('pl-PL') : '';
      var who = state.publishedBy === 'admin' ? 'administrator' : 'sprzedający';
      note.textContent = 'Opublikowano ' + when + ' (' + who + ')' + (state.count > 1 ? ', łącznie ' + state.count + '×' : '') + '.';
      if (state.recent && role === 'seller') {
        note.textContent += ' Jeśli post już jest w grupie, nie dodawaj kolejnego tego samego dnia.';
      }
    }
    refreshNote();

    copyBtn.addEventListener('click', function () {
      var text = buildPostText(listing, { role: role });
      copyText(text).then(function (ok) {
        if (ok) {
          setStatus(status, 'Skopiowano. Otwórz grupę i wklej (Ctrl+V / długie przytrzymanie).', 'ok');
          track('share_copy', { listing_id: listingKey(listing) });
        } else {
          setStatus(status, 'Nie udało się skopiować. Zaznacz tekst z podglądu i skopiuj ręcznie.', 'warn');
        }
      });
    });

    imageBtn.addEventListener('click', function () {
      setStatus(status, 'Pobieram zdjęcie…');
      downloadImage(listing).then(function (result) {
        if (result.ok) {
          setStatus(status, 'Zdjęcie pobrane: ' + result.fileName + '. Dodaj je w poście.', 'ok');
          track('share_download', { listing_id: listingKey(listing) });
        } else if (result.reason === 'brak-zdjecia') {
          setStatus(status, 'To ogłoszenie nie ma zdjęcia — opublikuj sam tekst z linkiem.', 'warn');
        } else {
          setStatus(status, 'Zdjęcie otwarte w nowej karcie — zapisz je (prawy klik → Zapisz obraz).', 'warn');
          track('share_download_fallback', { listing_id: listingKey(listing) });
        }
      });
    });

    groupBtn.addEventListener('click', function () {
      openGroup();
      setStatus(status, 'Grupa otwarta w nowej karcie. Wklej tekst i dodaj zdjęcie.', 'ok');
      track('share_open_group', { listing_id: listingKey(listing) });
    });

    doneBtn.addEventListener('click', function () {
      markPublished(listing, role);
      refreshNote();
      setStatus(status, 'Zapisane. Dziękujemy — ogłoszenie oznaczone jako udostępnione.', 'ok');
      track('share_published', { listing_id: listingKey(listing) });
    });

    return panel;
  }

  function mount(target, listing, options) {
    if (!target || !listing) return null;
    var panel = renderPanel(listing, options);
    target.innerHTML = '';
    target.appendChild(panel);
    return panel;
  }

  /* -------------------------------- modal ------------------------------- */

  var activeModal = null;
  var modalSeq = 0;

  function closeActiveModal() {
    if (activeModal && typeof activeModal.close === 'function') activeModal.close();
  }

  function openModal(listing, options) {
    if (!listing) return null;

    closeActiveModal();

    var opts = assign({}, config, options || {});
    var role = opts.role || config.role;
    var titleId = 'wsg-modal-title-' + (++modalSeq);

    var previouslyFocused = document.activeElement;
    var previousOverflow = document.body.style.overflow;

    var overlay = el('div', 'wsg-modal-overlay');
    var dialog = el('div', 'wsg-modal');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', titleId);
    dialog.setAttribute('tabindex', '-1');

    var closeBtn = el('button', 'wsg-modal__close', '×');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Zamknij');
    dialog.appendChild(closeBtn);

    var panel = renderPanel(listing, { role: role });
    dialog.appendChild(panel);

    var titleNode = panel.querySelector('.wsg__title');
    if (titleNode) titleNode.id = titleId;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var closed = false;

    function onKeyDown(event) {
      if (event.key === 'Escape' || event.keyCode === 27) {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      // Prosty focus trap wewnątrz dialogu.
      var focusables = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onOverlayClick(event) {
      if (event.target === overlay) close();
    }

    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKeyDown, true);
      overlay.removeEventListener('mousedown', onOverlayClick);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.style.overflow = previousOverflow;
      if (activeModal && activeModal.overlay === overlay) activeModal = null;
      try {
        if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
      } catch (err) { /* element mógł zniknąć z DOM — ignorujemy */ }
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('mousedown', onOverlayClick);
    document.addEventListener('keydown', onKeyDown, true);

    activeModal = { overlay: overlay, dialog: dialog, close: close };

    track('share_modal_open', { listing_id: listingKey(listing), role: role });

    try {
      closeBtn.focus();
    } catch (err) {
      try { dialog.focus(); } catch (err2) { /* ignorujemy */ }
    }

    return activeModal;
  }

  function closeModal() {
    closeActiveModal();
  }

  function parseListing(node) {
    var raw = node.getAttribute('data-listing');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      if (global.console && console.warn) console.warn('[WroomerShare] Nieprawidłowy JSON w data-listing', node);
      return null;
    }
  }

  function autoMount(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll(config.mountTargets);
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.getAttribute('data-wsg-mounted') === '1') return;
      var listing = parseListing(node);
      if (!listing) return;
      var role = node.getAttribute('data-role') || config.role;
      mount(node, listing, { role: role });
      node.setAttribute('data-wsg-mounted', '1');
    });
  }

  function configure(next) {
    config = assign({}, config, next || {});
    return config;
  }

  var api = {
    version: VERSION,
    configure: configure,
    mount: mount,
    openModal: openModal,
    closeModal: closeModal,
    autoMount: autoMount,
    buildPostText: buildPostText,
    copyText: copyText,
    downloadImage: downloadImage,
    openGroup: openGroup,
    markPublished: markPublished,
    getStatus: getStatus,
    cityOf: cityOf
  };

  global.WroomerShare = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { autoMount(); });
  } else {
    autoMount();
  }
})(window);
