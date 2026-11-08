/* AI OASIS — диагностика браузера. Загружается только по ссылке с ?diag (посетители её не видят).
   Показывает, что браузер сообщает сайту: настройки движения, поддержку технологий, ошибки скриптов,
   включилось ли поэтапное чтение. Ничего не отправляет — только выводит на экран. */
(function () {
  function mm(q) { try { return matchMedia(q).matches ? 'да' : 'нет'; } catch (e) { return '?'; } }
  function gl() {
    try { var c = document.createElement('canvas'); return c.getContext('webgl2') ? 'WebGL2' : (c.getContext('webgl') ? 'WebGL1' : 'нет'); } catch (e) { return 'ошибка'; }
  }
  function render() {
    var secs = [].slice.call(document.querySelectorAll('section[id]'));
    var ready = secs.filter(function (s) { return s.classList.contains('seq-ready'); }).map(function (s) { return s.id; });
    var hidden = 0, total = 0;
    [].forEach.call(document.querySelectorAll('.sq'), function (e) { total++; if (+getComputedStyle(e).opacity < .05) hidden++; });
    var c = navigator.connection || {};
    var rows = [
      ['Браузер', navigator.userAgent],
      ['Экран', innerWidth + '×' + innerHeight + ', плотность ' + (devicePixelRatio || 1)],
      ['Уменьшение движения (prefers-reduced-motion)', window.__yaMotion ? ((window.__rawReduce ? 'браузер сообщает «да»' : 'нет') + ' → Яндекс Браузер: сайт в полном режиме') : mm('(prefers-reduced-motion: reduce)')],
      ['Экономия данных (prefers-reduced-data / saveData)', mm('(prefers-reduced-data: reduce)') + ' / ' + (c.saveData ? 'да' : 'нет')],
      ['Сенсорный экран', mm('(pointer: coarse)')],
      ['IntersectionObserver', 'IntersectionObserver' in window ? 'есть' : 'НЕТ'],
      ['Карты импорта (3D-сцены)', (HTMLScriptElement.supports && HTMLScriptElement.supports('importmap')) ? 'есть' : 'НЕТ'],
      ['Видеографика', gl()],
      ['Заставка завершилась', window.__introDone ? 'да' : 'нет'],
      ['Классы страницы', document.documentElement.className || '—'],
      ['Поэтапное чтение включено в разделах', ready.length + ' из ' + secs.length + (ready.length ? '' : ' (не включилось)')],
      ['Скрыто блоков ниже экрана', hidden + ' из ' + total],
      ['Ошибки скриптов', (function () { var e = (window.__diagErr || []).filter(function (x) { return !/mc\.yandex|metrika/.test(x); }).map(function (x) { return x.replace(/\?[^ ]*/, ''); }); return e.length ? e.join('\n') : 'нет'; })()]
    ];
    var box = document.createElement('div');
    box.setAttribute('style', 'position:fixed;left:8px;right:8px;bottom:8px;max-height:72vh;overflow:auto;z-index:2147483647;background:#fff;color:#111;font:12px/1.4 -apple-system,Roboto,Arial,sans-serif;padding:12px 12px 8px;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.5)');
    var html = '<b style="font-size:14px">Диагностика AI OASIS</b><button style="float:right;font:inherit;padding:2px 10px" onclick="this.parentNode.remove()">×</button><table style="margin-top:8px;border-collapse:collapse;width:100%">';
    rows.forEach(function (r) {
      var bad = /НЕТ|не включилось|^да$/.test(r[1]) && /движения|IntersectionObserver|импорта|чтение/.test(r[0]) || (r[0] === 'Ошибки скриптов' && r[1] !== 'нет');
      html += '<tr><td style="vertical-align:top;padding:3px 8px 3px 0;color:#555;width:42%">' + r[0] + '</td><td style="padding:3px 0;word-break:break-word;white-space:pre-wrap;' + (bad ? 'color:#c0392b;font-weight:600' : '') + '">' + String(r[1]).replace(/</g, '&lt;') + '</td></tr>';
    });
    box.innerHTML = html + '</table><div style="color:#777;margin-top:6px">Сделайте снимок экрана и пришлите его.</div>';
    document.body.appendChild(box);
  }
  /* даём заставке и разделам время включиться */
  var done = false; function once() { if (!done) { done = true; render(); } }
  if (document.readyState === 'complete') setTimeout(once, 9000); else addEventListener('load', function () { setTimeout(once, 9000); });
  setTimeout(once, 20000); /* если событие load задерживается */
})();
