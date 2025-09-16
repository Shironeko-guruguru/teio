// --- プレイヤーデータ管理 ---
const player = {
  name: "ヒーロー",
  level: 1,
  gold: 0
};

function updatePlayerHUD() {
  const levelElement = document.getElementById('player-level');
  const nameElement = document.getElementById('player-name');
  levelElement.textContent = `Lv. ${player.level}`;
  nameElement.textContent = player.name;
}

// --- ここからが新しいページ遷移の処理 ---

// 1. 必要な要素をまとめて取得
const navButtons = document.querySelectorAll('.nav-button');
const pages = document.querySelectorAll('.page');

// 2. ページを切り替えるための関数
function showPage(pageId) {
  // すべてのページを一旦非表示にし、ボタンのアクティブ状態も解除
  pages.forEach(page => {
    page.classList.remove('active');
  });
  navButtons.forEach(button => {
    button.classList.remove('active');
  });

  // 指定されたIDのページだけを表示
  const targetPage = document.getElementById(pageId);
  targetPage.classList.add('active');
  
  // 対応するボタンをアクティブ状態にする
  const targetButton = document.querySelector(`.nav-button[data-page="${pageId}"]`);
  targetButton.classList.add('active');
}

// 3. 各ボタンにクリックイベントを設定
navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetPageId = button.dataset.page; // data-page属性の値を取得
    showPage(targetPageId);
  });
});


// --- 初期化処理 ---
// 最初に表示するHUDの更新
updatePlayerHUD();
// 最初に表示するページを指定（今回はホーム画面）
showPage('home-page');