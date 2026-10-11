/* ==================================================================
   画面を組み立てるプログラムです。
   ふだんは site-config.js だけ編集すれば大丈夫で、ここは触らなくてOKです。
   ================================================================== */

/* ---------- 小さな道具 ---------- */

// 要素を作る道具。文字は textContent で入れるので、記号を書いても安全です。
function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child === undefined || child === null || child === false) continue;
    node.append(child);
  }
  return node;
}

// 親要素に子要素を追加する道具。null や false は無視します(append に直接 null を渡すと「null」と表示されてしまうため)。
function add(parent, ...children) {
  for (const child of children.flat()) {
    if (child === undefined || child === null || child === false) continue;
    parent.append(child);
  }
  return parent;
}

// YouTubeのURL(または11文字のID)から、動画IDを取り出します。取れなければ null。
function getYouTubeId(input) {
  if (!input) return null;
  const idPattern = /^[\w-]{11}$/;
  if (idPattern.test(input)) return input;

  let url;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  let candidate = null;

  if (host === "youtu.be") {
    candidate = url.pathname.slice(1);
  } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const [first, second] = url.pathname.split("/").filter(Boolean);
    if (first === "watch") candidate = url.searchParams.get("v");
    else if (["shorts", "live", "embed"].includes(first)) candidate = second;
  }
  return candidate && idPattern.test(candidate) ? candidate : null;
}

// サムネイル画像のURL。image が指定されていればそれを優先します。
function getThumbnailUrl(item) {
  if (item.image) return item.image;
  const id = getYouTubeId(item.url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

// リンクの共通設定(新しいタブで開くかどうか)
function linkProps(url) {
  const props = { href: url };
  if (SITE.options.openInNewTab) {
    props.target = "_blank";
    props.rel = "noopener";
  }
  return props;
}

// id から媒体の設定を探します。見つからなくても止まらないようにしています。
function findMedia(id) {
  return (
    SITE.media.list.find((m) => m.id === id) || {
      id,
      name: id,
      color: SITE.theme.color,
    }
  );
}

/* ---------- ヘッダー ---------- */

function applyTheme() {
  document.documentElement.style.setProperty("--sky", SITE.theme.color);
}

function renderHero() {
  const { headerImage } = SITE.profile;
  if (!headerImage) return;
  const hero = document.getElementById("hero");
  hero.classList.add("hero--custom");
  hero.style.backgroundImage = `url("${headerImage}")`;
}

// カザグルマをクリック(タップ)すると、くるっと回ります
function setupPinwheel() {
  const spinner = document.getElementById("pinwheel");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!spinner || reduceMotion) return;

  let angle = 0;
  spinner.addEventListener("click", () => {
    angle += 720;
    spinner.style.transform = `rotate(${angle}deg)`;
  });
}

/* ---------- 自己紹介 ---------- */

function renderProfile() {
  const p = SITE.profile;
  const root = document.getElementById("profile");

  add(
    root,
    h("img", {
      class: "profile__icon",
      src: p.icon,
      alt: `${p.name}のアイコン`,
      width: 112,
      height: 112,
    }),
    h("h1", { class: "profile__name", text: p.name }),
    p.nickname ? h("p", { class: "profile__nickname", text: `呼び名は「${p.nickname}」` }) : null,
    p.title ? h("p", { class: "profile__title", text: p.title }) : null,
    h("div", { class: "profile__bio" }, p.bio.map((line) => h("p", { text: line }))),
    p.social && p.social.length > 0
      ? h(
          "ul",
          { class: "profile__social" },
          p.social.map((s) =>
            h("li", {}, h("a", { class: "pill", ...linkProps(s.url), text: s.label }))
          )
        )
      : null
  );
}

/* ---------- 最新とおすすめ ---------- */

// カードの画像部分。画像が無い・読み込めないときは、媒体名の色タイルを出します。
function createThumbnail(item, media) {
  const thumb = h("div", { class: "item__thumb" });
  thumb.style.setProperty("--c", media.color);
  thumb.append(h("span", { class: "item__tile", text: media.name }));

  const src = getThumbnailUrl(item);
  if (src) {
    const img = h("img", { src, alt: "", loading: "lazy" });
    img.addEventListener("error", () => img.remove());
    thumb.append(img);
  }
  return thumb;
}

function createFeaturedCard(item) {
  const media = findMedia(item.media);
  const badge = h("span", { class: "badge" }, h("span", { class: "badge__dot" }), media.name);
  badge.firstChild.style.background = media.color;

  return h(
    "a",
    { class: "item", ...linkProps(item.url) },
    createThumbnail(item, media),
    h(
      "div",
      { class: "item__body" },
      badge,
      h("p", { class: "item__title", text: item.title }),
      item.note ? h("p", { class: "item__note", text: item.note }) : null
    )
  );
}

function renderFeatured() {
  const f = SITE.featured;
  const root = document.getElementById("featured");

  const tabList = h("div", { class: "tabs", role: "tablist", "aria-label": f.title });
  const panel = h("div", { class: "tabpanel", role: "tabpanel", id: "featured-panel" });

  const tabButtons = f.tabs.map((tab, index) =>
    h("button", {
      type: "button",
      class: "tab",
      role: "tab",
      id: `tab-${tab.id}`,
      "aria-controls": "featured-panel",
      text: tab.label,
      onclick: () => select(index),
    })
  );
  tabList.append(...tabButtons);

  // index 番目のタブを選んで、中身を入れ替えます
  function select(index, { focus = false } = {}) {
    tabButtons.forEach((button, i) => {
      const selected = i === index;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });

    const tab = f.tabs[index];
    panel.setAttribute("aria-labelledby", `tab-${tab.id}`);
    panel.replaceChildren(
      tab.items.length > 0
        ? h("div", { class: "items" }, tab.items.map(createFeaturedCard))
        : h("p", { class: "empty", text: f.emptyMessage })
    );
  }

  // キーボード操作(← → Home End)
  tabList.addEventListener("keydown", (event) => {
    const current = tabButtons.findIndex((b) => b.getAttribute("aria-selected") === "true");
    const last = tabButtons.length - 1;
    const moves = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      select(moves[event.key], { focus: true });
    }
  });

  root.append(h("h2", { class: "section-title", id: "featured-title", text: f.title }), tabList, panel);
  select(0);
}

/* ---------- 活動している場所 ---------- */

// 自己紹介動画のプレイヤー。再生ボタンを押すまで動画は読み込みません。
function createPlayer({ video, title = "動画" }) {
  const id = getYouTubeId(video);
  const frame = h("div", { class: "player" });

  const startButton = h(
    "button",
    { type: "button", class: "player__start", "aria-label": `${title}を再生` },
    h("img", { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, alt: "", loading: "lazy" }),
    h("span", { class: "player__icon", "aria-hidden": "true" })
  );
  startButton.addEventListener("click", () => {
    frame.replaceChildren(
      h("iframe", {
        src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
        title,
        allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
        allowfullscreen: "",
      })
    );
  });
  frame.append(startButton);

  return h("figure", { class: "player-wrap" }, frame, h("figcaption", { class: "player__caption", text: title }));
}

function createMediaCard(m) {
  const size = m.size || "normal";
  const card = h("article", { class: `media-card media-card--${size}` });
  card.style.setProperty("--c", m.color || SITE.theme.color);

  const dot = h("span", { class: "media-card__dot", "aria-hidden": "true" });
  const hasPlayer = m.player && getYouTubeId(m.player.video);

  if (size === "large") {
    // 大きいカード: 説明、プレイヤー、ボタン
    add(
      card,
      h("h3", { class: "media-card__name" }, dot, m.name),
      h("p", { class: "media-card__desc", text: m.description }),
      hasPlayer ? createPlayer(m.player) : null,
      h("a", { class: "button", ...linkProps(m.url), text: m.button || `${m.name}を開く` })
    );
  } else {
    // ふつう・小さいカード: カード全体がリンク
    add(
      card,
      h(
        "div",
        { class: "media-card__text" },
        h("h3", { class: "media-card__name" }, dot, h("a", { class: "media-card__link", ...linkProps(m.url), text: m.name })),
        h("p", { class: "media-card__desc", text: m.description })
      ),
      h("span", { class: "media-card__go", "aria-hidden": "true", text: "開く" })
    );
  }
  return card;
}

function renderMedia() {
  const m = SITE.media;
  document.getElementById("media").append(
    h("h2", { class: "section-title", id: "media-title", text: m.title }),
    h("div", { class: "media-list" }, m.list.map(createMediaCard))
  );
}

/* ---------- ページ下部 ---------- */

function renderFooter() {
  document.getElementById("footer").append(
    h("p", { text: `© ${new Date().getFullYear()} ${SITE.footer.name}` })
  );
}

/* ---------- 実行 ---------- */

applyTheme();
renderHero();
setupPinwheel();
renderProfile();
renderFeatured();
renderMedia();
renderFooter();
