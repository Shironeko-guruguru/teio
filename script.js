// ===============================================
// ▼▼▼ ゲームのデータ管理 ▼▼▼
// ===============================================

// --- プレイヤーデータ ---
// ===============================================
// ▼▼▼ ゲームのデータ管理 ▼▼▼
// ===============================================

// --- プレイヤーデータ ---
const player = {
  name: "ヒーロー",
  level: 1,
  gold: 100,
  materials: 10 // 強化素材を10個持っている状態からスタート
};

// --- キャラクターデータ ---
const characters = [
  {
    id: 'char001',
    name: '剣士',
    stars: 3,         // level を stars に変更
    maxStars: 5,      // 星の最大数を追加
    skills: ['スラッシュ'],
    rankUpCost: 10    // levelUpCost を rankUpCost に変更し、コストを調整
  },
  {
    id: 'char002',
    name: '魔法使い',
    stars: 2,
    maxStars: 5,
    skills: ['ファイアボール'],
    rankUpCost: 15
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



// script.js の描画セクションの上あたりに追加

// ===============================================
// ▼▼▼ 画面の描画・更新処理 ▼▼▼
// ===============================================

// --- 星評価を生成するヘルパー関数 ---
function generateStarRating(stars, maxStars) {
  let starString = '';
  for (let i = 0; i < maxStars; i++) {
    starString += (i < stars) ? '★' : '☆';
  }
  return starString;
}

// --- プレイヤーHUDの更新 ---
function updatePlayerHUD() {
  const levelElement = document.getElementById('player-level');
  const nameElement = document.getElementById('player-name');
  const materialsElement = document.getElementById('player-materials'); // ▼▼▼ 追加

  levelElement.textContent = `Lv. ${player.level}`;
  nameElement.textContent = player.name;
  materialsElement.textContent = `強化素材: ${player.materials}`; // ▼▼▼ 追加
}

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

    // ▼▼▼ ここからが新しい処理 ▼▼▼
    // ボタンがクリックされた時の処理を追加
    completeButton.addEventListener('click', () => {
      // 1. どのタスクがクリックされたかIDで探す
      const targetTask = tasks.find(t => t.id === task.id);
      if (targetTask) {
        // 2. 見つかったタスクのcompletedフラグをtrueに更新
        targetTask.completed = true;
        // 3. 画面を再描画して変更を反映する
        renderTaskList();
      }
    });
    // ▲▲▲ ここまでが新しい処理 ▲▲▲
    
    listItem.appendChild(textSpan);
    listItem.appendChild(completeButton);
    taskListElement.appendChild(listItem);
  });
}

// script.js の renderKyokaPage 関数をまるごと差し替える

// --- 強化ページの描画 ---
function renderKyokaPage() {
  const characterListElement = document.getElementById('character-list');
  characterListElement.innerHTML = ''; // 一旦リストを空にする

  characters.forEach(char => {
    const card = document.createElement('div');
    card.className = 'character-card';

    // generateStarRating関数を使って星表示を生成
    const starDisplay = generateStarRating(char.stars, char.maxStars);

    card.innerHTML = `
      <div class="character-header">
        <span class="character-name">${char.name}</span>
        <span class="character-rank">${starDisplay}</span> 
      </div>
      <p>スキル:</p>
      <ul class="skill-list">
        ${char.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
      <div class="action-buttons">
        <button data-char-id="${char.id}" class="rankup-btn">ランクアップ (コスト: ${char.rankUpCost})</button>
        <button data-char-id="${char.id}" class="skill-btn">スキル取得</button>
      </div>
    `;
    
    // --- クリック処理 ---
    const rankUpButton = card.querySelector('.rankup-btn');

    // すでに最大ランクならボタンを押せなくする
    if (char.stars >= char.maxStars) {
      rankUpButton.textContent = 'MAX RANK';
      rankUpButton.disabled = true;
    }

    rankUpButton.addEventListener('click', () => {
      const targetChar = characters.find(c => c.id === char.id);
      
      if (targetChar.stars >= targetChar.maxStars) {
        alert('これ以上ランクアップできません。');
        return; // 処理を中断
      }
      
      if (player.materials >= targetChar.rankUpCost) {
        player.materials -= targetChar.rankUpCost;
        targetChar.stars += 1;
        
        updatePlayerHUD();
        renderKyokaPage();
      } else {
        alert('強化素材が足りません！');
      }
    });

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