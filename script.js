// 1. プレイヤーのデータをオブジェクトとして一元管理
// 今後、HPや所持金などもここに追加していくと便利です。
const player = {
  name: "ヒーロー",
  level: 1,
  gold: 0
};

// 2. 画面の表示を更新するための「関数」を用意
// この関数を呼び出すだけで、いつでも画面を最新のデータに更新できます。
function updatePlayerHUD() {
  // HTMLからIDを使って要素を取得
  const levelElement = document.getElementById('player-level');
  const nameElement = document.getElementById('player-name');

  // 取得した要素のテキストをプレイヤーのデータで書き換える
  // `` (バッククォート) を使うと、文字と変数をスッキリ組み合わせられます。
  levelElement.textContent = `Lv. ${player.level}`;
  nameElement.textContent = player.name;
}


// --- ここからが実際の処理 ---

// 3. ゲームが読み込まれた時に、一度だけHUDの表示を更新する
// これで、HTMLに書かれていた仮の表示が、JavaScriptのデータに置き換わります。
updatePlayerHUD();

// (テスト用) 5秒後にレベルが上がる処理
setTimeout(() => {
  player.level = 2; // プレイヤーのレベルを2に更新
  updatePlayerHUD(); // 再度HUD更新関数を呼び出して、画面に反映！
  console.log('レベルが上がった！');
}, 5000); // 5000ミリ秒 = 5秒
