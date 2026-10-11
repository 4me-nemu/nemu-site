/* ==================================================================
   サイトの中身は、このファイルだけ書き換えればOKです。
   「★」がついている所は、仮の内容です。自分のものに差し替えてください。
   文字は "ダブルクォーテーション" で囲み、行の最後のカンマ( , )は消さないでください。
   ================================================================== */

const SITE = {

  /* ---------- 全体の設定 ---------- */
  theme: {
    // イメージカラー。ボタンや見出しの背景に使われます。
    // 文字は濃い色で載せるので、明るめの色が向いています。
    color: "#85D6FF",
  },

  options: {
    // true: リンクを新しいタブで開く / false: 同じタブで開く
    openInNewTab: true,
    },

      // 画面の右上についてくるカザグルマ(スクロールに合わせて回ります)
  followPinwheel: {
    enabled: true,   // false にすると表示されません
    showAfter: 140,  // 何px スクロールしたら出すか。0 なら最初から表示
  },

  /* ---------- 自己紹介 ---------- */
  profile: {
    name: "雨宮 眠夢",
    nickname: "ねむ",                       // 呼び名。不要なら "" にすると表示されません
    title: "風まかせに何でも作る人",         // ★肩書き(仮)
    bio: [                                  // ★自己紹介(仮)。1行ごとに段落が分かれます
      "配信や小説、モデリング、作曲など、作ることなら幅広くやっています。",
      "ここは、活動している場所をまとめたページです。気になるところから見てみてください。",
    ],
    icon: "assets/NEMU_icon.png",                // ★アイコン画像(仮)。assets に画像を入れて、ここを書き換え
    headerImage: "assets/NEMU_header.png",    // ヘッダー画像。空なら水色の背景とカザグルマが出ます
    headerAlt: "雨宮 眠夢のヘッダー画像",      // ヘッダー画像の説明文(読み上げ用)
    social: [                                // 名前の下に出る小さなボタン。不要なら [] にします
      { label: "Twitterをフォロー", url: "https://twitter.com/_nemurunemunemu" },  // ★自分のURLに
    ],
  },

  /* ---------- 最新とおすすめ ---------- */
  // ・media には、下の media.list の id を書きます
  // ・YouTubeの動画URLを書くと、サムネイル画像が自動で出ます
  // ・YouTube以外で画像を出したいときは、image に画像のパスやURLを書きます
  // ・カードを増やすときは { ... }, を1つぶんコピーして足してください
  featured: {
    title: "最新とおすすめ",
    emptyMessage: "準備中です。",
    tabs: [
      {
        id: "latest",
        label: "最新",
        items: [
          {   // ★仮の内容。動画のURLに差し替えるとサムネが出ます
            media: "youtube",
            title: "最新の動画のタイトル",
            url: "https://www.youtube.com/watch?v=動画ID",
            note: "一言メモ(いらなければ消してOK)",
          },
          {   // ★仮の内容
            media: "note",
            title: "最新の小説のタイトル",
            url: "https://note.com/_nemurunemu/m/m9ba9b7ff8f9c",
            // image: "assets/novel-cover.png",
          },
        ],
      },
      {
        id: "pick",
        label: "おすすめ",
        items: [
          {   // ★仮の内容
            media: "youtube",
            title: "まずはこれを見てほしい動画",
            url: "https://www.youtube.com/live/XX4w0L6Ts_w?si=d_OTFYbxYIiuL5ZO",
          },
        ],
      },
    ],
  },

  /* ---------- 活動している場所 ---------- */
  // ・上にあるものほど、ページの上に表示されます
  // ・size は "large"(大きい) / "normal"(ふつう) / "small"(小さい) から選びます
  // ・color は、最新・おすすめのカードの目印の色です
  media: {
    title: "活動している場所",
    list: [
      {
        id: "youtube",
        name: "YouTube",
        color: "#E8483F",
        size: "large",
        description: "配信や楽曲を投稿しています。",
        url: "https://www.youtube.com/@nemurunemu_nemu",                 // ★チャンネルのURLに
        button: "YouTubeを開く",
        player: {
          video: "https://www.youtube.com/watch?v=XX4w0L6Ts_w",                                      // ★自己紹介動画のURLまたはID。空なら表示されません
          title: "自己紹介動画",
        },
      },
      {
        id: "note",
        name: "note",
        color: "#41C9B4",
        size: "normal",
        description: "小説を投稿しています。",
        url: "https://note.com/_nemurunemu",                         // ★自分のURLに
      },
      {
        id: "twitch",
        name: "Twitch",
        color: "#9146FF",
        size: "small",
        description: "サブの配信先です。",
        url: "https://www.twitch.tv/nemurunemu_",                    // ★自分のURLに
      },
      {
        id: "twitter",
        name: "Twitter",
        color: "#1D9BF0",
        size: "small",
        description: "活動の宣伝と、配信開始のお知らせを投稿しています。",
        url: "https://twitter.com/_nemurunemunemu",                      // ★自分のURLに
      },

      // 媒体が増えたら、ここに足してください(例)。先頭の // を外すと有効になります。
      // {
      //   id: "booth",
      //   name: "BOOTH",
      //   color: "#FC4D50",
      //   size: "normal",
      //   description: "モデリングしたものを販売しています。",
      //   url: "https://booth.pm/",
      // },
    ],
  },

  /* ---------- ページ下部 ---------- */
  footer: {
    name: "雨宮 眠夢",   // 「© 年 名前」の形で表示されます(年は自動)
  },
};
