// ===============================================
// ▼▼▼ ゲームのデータ管理 ▼▼▼
// ===============================================

const player = {
  name: "ヒーロー",
  level: 1,
  gold: 100,
  materials: 10
};

const characters = [
  {
    id: 'char001',
    name: '剣士',
    stars: 3,
    maxStars: 5,
    skillPoints: 5,
    skills: ['スラッシュ'],
    rankUpCost: 10,
    acquirableSkills: [
      { id: 'skill01', name: 'パワースラッシュ', cost: 3, description: '通常より強力な斬撃を放つ。' },
      { id: 'skill02', name: 'ディフェンスアップ', cost: 2, description: '一定時間、防御力が上昇する。' },
      { id: 'skill03', name: 'ファーストエイド', cost: 4, description: '自身のHPを少し回復する。' }
    ]
  },
  {
    id: 'char002',
    name: '魔法使い',
    stars: 2,
    maxStars: 5,
    skillPoints: 8,
    skills: ['ファイアボール'],
    rankUpCost: 15,
    acquirableSkills: [
      { id: 'skill04', name: 'アイスランス', cost: 3, description: '氷の槍で敵を貫く。' },
      { id: 'skill05', name: 'マナシールド', cost: 5, description: '受けたダメージをMPで肩代わりする。' },
      { id: 'skill06', name: 'サンダーボルト', cost: 5, description: '雷を落とし、敵を麻痺させることがある。' }
    ]
  }
];

const tasks = [
  { id: 'task001', text: 'スライムを10匹倒す', completed: true },
  { id: 'task002', text: 'ポーションを3個集める', completed: false },
  { id: 'task003', text: 'デイリーログインボーナスを受け取る', completed: false }
];


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
  const materialsElement = document.getElementById('player-materials');
  levelElement.textContent = `Lv. ${player.level}`;
  nameElement.textContent = player.name;
  materialsElement.textContent = `強化素材: ${player.materials}`;
}

// --- タスクリストの描画 ---
function renderTaskList() {
  const taskListElement = document.getElementById('task-list');
  taskListElement.innerHTML = '';
  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';
    if (task.completed) { listItem.classList.add('completed'); }
    const textSpan = document.createElement('span');
    textSpan.textContent = task.text;
    const completeButton = document.createElement('button');
    completeButton.textContent = '完了';
    if (task.completed) {
      completeButton.disabled = true;
      completeButton.textContent = '達成済';
    }
    completeButton.addEventListener('click', () => {
      const targetTask = tasks.find(t => t.id === task.id);
      if (targetTask) {
        targetTask.completed = true;
        renderTaskList();
      }
    });
    listItem.appendChild(textSpan);
    listItem.appendChild(completeButton);
    taskListElement.appendChild(listItem);
  });
}

// --- 強化ページの描画 ---
function renderKyokaPage() {
  const characterListElement = document.getElementById('character-list');
  characterListElement.innerHTML = '';
  characters.forEach(char => {
    const card = document.createElement('div');
    card.className = 'character-card';
    const starDisplay = generateStarRating(char.stars, char.maxStars);
    card.innerHTML = `
      <div class="character-header">
        <span class="character-name">${char.name}</span>
        <span class="character-rank">${starDisplay}</span>
      </div>
      <p>スキル: (SP: ${char.skillPoints})</p>
      <ul class="skill-list">
        ${char.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
      <div class="action-buttons">
        <button data-char-id="${char.id}" class="rankup-btn">ランクアップ (コスト: ${char.rankUpCost})</button>
        <button data-char-id="${char.id}" class="skill-btn">スキル取得</button>
      </div>
    `;

    // ▼▼▼ 復元: ランクアップボタンの処理 ▼▼▼
    const rankUpButton = card.querySelector('.rankup-btn');
    if (char.stars >= char.maxStars) {
      rankUpButton.textContent = 'MAX RANK';
      rankUpButton.disabled = true;
    }
    rankUpButton.addEventListener('click', () => {
      const targetChar = characters.find(c => c.id === char.id);
      if (targetChar.stars >= targetChar.maxStars) { return; }
      if (player.materials >= targetChar.rankUpCost) {
        player.materials -= targetChar.rankUpCost;
        targetChar.stars += 1;
        updatePlayerHUD();
        renderKyokaPage();
      } else {
        alert('強化素材が足りません！');
      }
    });

    // --- スキル取得ボタンの処理 ---
    const skillButton = card.querySelector('.skill-btn');
    skillButton.addEventListener('click', () => {
      openSkillModal(char.id);
    });
    characterListElement.appendChild(card);
  });
}


// ===============================================
// ▼▼▼ スキル取得モーダルの管理 ▼▼▼
// ===============================================
const skillModal = document.getElementById('skill-modal');

function openSkillModal(characterId) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return;
  const modalCharName = document.getElementById('modal-char-name');
  const modalSkillPoints = document.getElementById('modal-skill-points');
  const modalSkillList = document.getElementById('modal-skill-list');
  modalCharName.textContent = char.name;
  modalSkillPoints.textContent = char.skillPoints;
  modalSkillList.innerHTML = '';
  char.acquirableSkills.forEach(skill => {
    const isLearned = char.skills.includes(skill.name);
    const skillItem = document.createElement('div');
    skillItem.className = 'modal-skill-item';
    skillItem.innerHTML = `
      <h4>${skill.name} (コスト: ${skill.cost})</h4>
      <p>${skill.description}</p>
      <button data-skill-id="${skill.id}">取得</button>
    `;
    const acquireButton = skillItem.querySelector('button');
    if (char.skillPoints < skill.cost || isLearned) {
      acquireButton.disabled = true;
      if (isLearned) acquireButton.textContent = '習得済';
    }
    acquireButton.addEventListener('click', () => {
      char.skillPoints -= skill.cost;
      char.skills.push(skill.name);
      renderKyokaPage();
      openSkillModal(characterId);
    });
    modalSkillList.appendChild(skillItem);
  });
  skillModal.classList.add('active');
}

function closeSkillModal() {
  skillModal.classList.remove('active');
}
document.getElementById('modal-close-btn').addEventListener('click', closeSkillModal);


// ===============================================
// ▼▼▼ 復元: ページ遷移の管理 ▼▼▼
// ===============================================
const navButtons = document.querySelectorAll('.nav-button');
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
  pages.forEach(page => page.classList.remove('active'));
  navButtons.forEach(button => button.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelector(`.nav-button[data-page="${pageId}"]`).classList.add('active');
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
showPage('home-page');