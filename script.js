// ===============================================
// ▼▼▼ ゲームのデータ管理 ▼▼▼
// ===============================================

// --- プレイヤーデータ ---
const player = {
  name: "ヒーロー",
  level: 1,
  gold: 100 // レベルアップ用に所持金を追加
};

// --- キャラクターデータ ---
// 配列とすることで、複数のキャラクターを管理できるようにします
const characters = [
  {
    id: 'char001',
    name: '剣士',
    level: 5,
    skills: ['スラッシュ']
  },
  {
    id: 'char002',
    name: '魔法使い',
    level: 3,
    skills: ['ファイアボール']
  }
];

// --- タスクデータ ---
const tasks = [
  {
    id: 'task001',
    text: 'スライムを10匹倒す',
    completed: true // 達成済みかどうかのフラグ
  },
  {
    id: 'task002',
    text: 'ポーションを3個集める',
    completed: false
  },
  {
    id: 'task003',
    text: 'デイリーログインボーナスを受け取る',
    completed: false
  }
];


// ===============================================
// ▼▼▼ 画面の描画・更新処理 ▼▼▼
// ===============================================

// --- プレイヤーHUDの更新 ---
function updatePlayerHUD() {
  const levelElement = document.getElementById('player-level');
  const nameElement = document.getElementById('player-name');
  levelElement.textContent = `Lv. ${player.level}`;
  nameElement.textContent = player.name;
}

// --- タスクリストの描画 ---
function renderTaskList() {
  const taskListElement = document.getElementById('task-list');
  taskListElement.innerHTML = ''; // 一旦リストを空にする

  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';
    if (task.completed) {
      listItem.classList.add('completed');
    }
    
    // タスクのテキスト部分
    const textSpan = document.createElement('span');
    textSpan.textContent = task.text;
    
    // 完了ボタン
    const completeButton = document.createElement('button');
    completeButton.textContent = '完了';
    if (task.completed) {
      completeButton.disabled = true; // 達成済みならボタンを押せなくする
      completeButton.textContent = '達成済';
    }
    
    listItem.appendChild(textSpan);
    listItem.appendChild(completeButton);
    taskListElement.appendChild(listItem);
  });
}

// --- 強化ページの描画 ---
function renderKyokaPage() {
  const characterListElement = document.getElementById('character-list');
  characterListElement.innerHTML = ''; // 一旦リストを空にする

  characters.forEach(char => {
    // 1キャラ分のカードを作成
    const card = document.createElement('div');
    card.className = 'character-card';

    // カードのHTMLの中身を `` (バッククォート) で一気に作成
    card.innerHTML = `
      <div class="character-header">
        <span class="character-name">${char.name}</span>
        <span class="character-level">Lv. ${char.level}</span>
      </div>
      <p>スキル:</p>
      <ul class="skill-list">
        ${char.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
      <div class="action-buttons">
        <button>レベルアップ</button>
        <button>スキル取得</button>
      </div>
    `;
    
    characterListElement.appendChild(card);
  });
}


// ===============================================
// ▼▼▼ ページ遷移の管理 ▼▼▼
// ===============================================
const navButtons = document.querySelectorAll('.nav-button');
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
  pages.forEach(page => page.classList.remove('active'));
  navButtons.forEach(button => button.classList.remove('active'));

  document.getElementById(pageId).classList.add('active');
  document.querySelector(`.nav-button[data-page="${pageId}"]`).classList.add('active');
  
  // ページが切り替わったタイミングで、そのページに必要な描画処理を呼び出す
  if (pageId === 'task-page') {
    renderTaskList();
  } else if (pageId === 'kyoka-page') {
    renderKyokaPage();
  }
}

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    showPage(button.dataset.page);
  });
});


// ===============================================
// ▼▼▼ ゲームの初期化処理 ▼▼▼
// ===============================================
updatePlayerHUD();
showPage('home-page'); // 最初に表示するページ