// ===============================================
// ▼▼▼ ゲームのデータ管理 ▼▼▼
// ===============================================
let player, characters, tasks;

// --- 初期化用のデフォルトデータ ---
const defaultGameData = {
  player: { name: "ヒーロー", level: 1, gold: 100, materials: 10 },
  characters: [], // キャラクターデータは外部ファイルから読み込むため、ここは空にしておく
  tasks: [
    { id: 'task001', text: 'スライムを10匹倒す', completed: false, reward: 5 },
    { id: 'task002', text: 'ポーションを3個集める', completed: false, reward: 3 },
    { id: 'task003', text: 'デイリーログインボーナスを受け取る', completed: false, reward: 10 }
  ]
};

// --- 読み込むキャラクターファイルのリスト ---
const characterFiles = ['char001.json', 'char002.json', 'char003.json'];


// ===============================================
// ▼▼▼ データ読み込み処理 ▼▼▼
// ===============================================
async function loadCharacterData() {
  const loadedCharacters = [];
  for (const file of characterFiles) {
    try {
      // ★★★ 修正点1: フォルダ名を "date" から "data" に修正 ★★★
      const response = await fetch(`./data/${file}`);
      if (!response.ok) {
        throw new Error(`ファイルが見つかりません: ${file}`);
      }
      const data = await response.json();
      loadedCharacters.push(data);
    } catch (error) {
      console.error('キャラクターデータの読み込みに失敗しました:', error);
    }
  }
  return loadedCharacters;
}


// ===============================================
// ▼▼▼ セーブ＆ロード処理 ▼▼▼
// ===============================================
const SAVE_KEY = 'myGameSaveData';

function saveGame() {
  const saveData = { player: player, characters: characters, tasks: tasks };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  alert('ゲームデータを保存しました！');
}

async function loadGame() {
  const savedDataString = localStorage.getItem(SAVE_KEY);
  if (savedDataString) {
    const loadedData = JSON.parse(savedDataString);
    player = loadedData.player;
    characters = loadedData.characters;
    tasks = loadedData.tasks;
    console.log('セーブデータをロードしました。');
  } else {
    player = JSON.parse(JSON.stringify(defaultGameData.player));
    characters = await loadCharacterData();
    tasks = JSON.parse(JSON.stringify(defaultGameData.tasks));
    console.log('セーブデータがなかったので、新規にゲームを開始します。');
  }
}

function deleteSaveData() {
  if (confirm('本当にセーブデータを削除しますか？この操作は元に戻せません。')) {
    localStorage.removeItem(SAVE_KEY);
    alert('セーブデータを削除しました。ページをリロードすると最初からになります。');
  }
}


// ===============================================
// ▼▼▼ 画面の描画・更新処理 ▼▼▼
// ===============================================

function generateStarRating(stars, maxStars) {
  let starString = '';
  for (let i = 0; i < maxStars; i++) { starString += (i < stars) ? '★' : '☆'; }
  return starString;
}

function updatePlayerHUD() {
  document.getElementById('player-level').textContent = `Lv. ${player.level}`;
  document.getElementById('player-name').textContent = player.name;
  document.getElementById('player-materials').textContent = `強化素材: ${player.materials}`;
}

function renderTaskList() {
  const taskListElement = document.getElementById('task-list');
  taskListElement.innerHTML = '';
  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';
    if (task.completed) { listItem.classList.add('completed'); }
    const textSpan = document.createElement('span');
    textSpan.textContent = `${task.text} (報酬: 素材x${task.reward})`;
    const completeButton = document.createElement('button');
    completeButton.textContent = '完了';
    if (task.completed) {
      completeButton.disabled = true;
      completeButton.textContent = '達成済';
    }
    completeButton.addEventListener('click', () => {
      const targetTask = tasks.find(t => t.id === task.id);
      if (targetTask && !targetTask.completed) {
        player.materials += targetTask.reward;
        targetTask.completed = true;
        updatePlayerHUD();
        renderTaskList();
      }
    });
    listItem.appendChild(textSpan);
    listItem.appendChild(completeButton);
    taskListElement.appendChild(listItem);
  });
}

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
    const rankUpButton = card.querySelector('.rankup-btn');
    if (char.stars >= char.maxStars) {
      rankUpButton.textContent = 'MAX RANK';
      rankUpButton.disabled = true;
    }
    rankUpButton.addEventListener('click', () => {
      const targetChar = characters.find(c => c.id === char.id);
      if (targetChar.stars >= targetChar.maxStars) return;
      if (player.materials >= targetChar.rankUpCost) {
        player.materials -= targetChar.rankUpCost;
        targetChar.stars += 1;
        updatePlayerHUD();
        renderKyokaPage();
      } else {
        alert('強化素材が足りません！');
      }
    });
    const skillButton = card.querySelector('.skill-btn');
    skillButton.addEventListener('click', () => {
      openSkillModal(char.id);
    });
    characterListElement.appendChild(card);
  });
}

function renderZukanPage() {
  const zukanGridElement = document.getElementById('zukan-grid');
  zukanGridElement.innerHTML = '';
  characters.forEach(char => {
    const card = document.createElement('div');
    card.className = 'zukan-card';
    const starDisplay = generateStarRating(char.stars, char.maxStars);
    card.innerHTML = `
      <div class="character-name">${char.name}</div>
      <div class="character-rank">${starDisplay}</div>
      <button data-char-id="${char.id}" class="zukan-detail-btn">詳細</button>
    `;
    const detailButton = card.querySelector('.zukan-detail-btn');
    detailButton.addEventListener('click', () => {
      openZukanDetailModal(char.id);
    });
    zukanGridElement.appendChild(card);
  });
}


// ===============================================
// ▼▼▼ スキル取得モーダルの管理 ▼▼▼
// ===============================================
// ★★★ 修正点2: このセクションの関数が抜けていたので復元 ★★★
const skillModal = document.getElementById('skill-modal');

function openSkillModal(characterId) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return;
  document.getElementById('modal-char-name').textContent = char.name;
  document.getElementById('modal-skill-points').textContent = char.skillPoints;
  const modalSkillList = document.getElementById('modal-skill-list');
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


// ===============================================
// ▼▼▼ 図鑑詳細モーダルの管理 ▼▼▼
// ===============================================
const zukanDetailModal = document.getElementById('zukan-detail-modal');

function openZukanDetailModal(characterId) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return;
  const modalHeader = document.getElementById('modal-zukan-header');
  const initialSkillsList = document.getElementById('modal-zukan-initial-skills');
  const acquirableSkillsList = document.getElementById('modal-zukan-acquirable-skills');
  const starDisplay = generateStarRating(char.stars, char.maxStars);
  modalHeader.innerHTML = `
    <span class="character-name">${char.name}</span>
    <span class="character-rank">${starDisplay}</span>
  `;
  initialSkillsList.innerHTML = char.skills.map(skill => `<li>${skill}</li>`).join('');
  acquirableSkillsList.innerHTML = char.acquirableSkills.map(skill =>
    `<li><strong>${skill.name}</strong> (コスト: ${skill.cost})<br><small>${skill.description}</small></li>`
  ).join('');
  zukanDetailModal.classList.add('active');
}

function closeZukanDetailModal() {
  zukanDetailModal.classList.remove('active');
}


// ===============================================
// ▼▼▼ ページ遷移と初期化 ▼▼▼
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
  } else if (pageId === 'zukan-page') {
    renderZukanPage();
  }
}

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    showPage(button.dataset.page);
  });
});

document.getElementById('save-button').addEventListener('click', saveGame);
document.getElementById('load-button').addEventListener('click', async () => {
  await loadGame();
  updatePlayerHUD();
  const currentPageId = document.querySelector('.page.active').id;
  showPage(currentPageId);
  alert('データをロードしました！');
});
document.getElementById('delete-button').addEventListener('click', deleteSaveData);

// ★★★ 修正点3: イベントリスナーの重複を削除し、整理 ★★★
document.getElementById('modal-close-btn').addEventListener('click', closeSkillModal);
document.getElementById('zukan-modal-close-btn').addEventListener('click', closeZukanDetailModal);

// --- ゲーム起動時のメイン処理 ---
async function initializeGame() {
  await loadGame();
  updatePlayerHUD();
  showPage('home-page');
}

// ゲーム開始！
initializeGame();