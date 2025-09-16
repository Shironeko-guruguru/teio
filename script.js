// ===============================================
// ▼▼▼ ゲームのデータ管理 ▼▼▼
// ===============================================
// (Step 1 で更新した player と characters のデータはここにペーストしてください)
const player = { name: "ヒーロー", level: 1, gold: 100, materials: 10 };
const characters = [ /* Step 1 の characters 配列 */ ];
const tasks = [ /* 既存の tasks 配列 */ ];


// ===============================================
// ▼▼▼ 画面の描画・更新処理 ▼▼▼
// ===============================================

// --- 星評価を生成するヘルパー関数 ---
function generateStarRating(stars, maxStars) { /* 変更なし */ }

// --- プレイヤーHUDの更新 ---
function updatePlayerHUD() { /* 変更なし */ }

// --- タスクリストの描画 ---
function renderTaskList() { /* 変更なし */ }

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

    // --- ランクアップボタンの処理 (変更なし) ---
    const rankUpButton = card.querySelector('.rankup-btn');
    // ... (ランクアップのロジックは省略) ...

    // ★★★ スキル取得ボタンの処理 ★★★
    const skillButton = card.querySelector('.skill-btn');
    skillButton.addEventListener('click', () => {
      openSkillModal(char.id); // キャラクターIDを渡してモーダルを開く
    });
    
    characterListElement.appendChild(card);
  });
}


// ===============================================
// ▼▼▼ スキル取得モーダルの管理 ▼▼▼
// ===============================================
const skillModal = document.getElementById('skill-modal');

// --- モーダルを開く ---
function openSkillModal(characterId) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return;

  // モーダル内の要素を取得
  const modalCharName = document.getElementById('modal-char-name');
  const modalSkillPoints = document.getElementById('modal-skill-points');
  const modalSkillList = document.getElementById('modal-skill-list');

  // キャラクターの情報をモーダルに反映
  modalCharName.textContent = char.name;
  modalSkillPoints.textContent = char.skillPoints;
  modalSkillList.innerHTML = ''; // リストを初期化

  // 習得可能スキルをリスト表示
  char.acquirableSkills.forEach(skill => {
    // 既に習得済みかチェック
    const isLearned = char.skills.includes(skill.name);
    
    const skillItem = document.createElement('div');
    skillItem.className = 'modal-skill-item';
    skillItem.innerHTML = `
      <h4>${skill.name} (コスト: ${skill.cost})</h4>
      <p>${skill.description}</p>
      <button data-skill-id="${skill.id}">取得</button>
    `;
    
    const acquireButton = skillItem.querySelector('button');
    // スキルポイントが足りないか、既に習得済みならボタンを無効化
    if (char.skillPoints < skill.cost || isLearned) {
      acquireButton.disabled = true;
      if(isLearned) acquireButton.textContent = '習得済';
    }
    
    // 取得ボタンのクリック処理
    acquireButton.addEventListener('click', () => {
      // データの更新
      char.skillPoints -= skill.cost;
      char.skills.push(skill.name);
      
      // 画面の再描画
      renderKyokaPage(); // カードの表示を更新
      openSkillModal(characterId); // モーダルの中身も最新の状態に更新
    });
    
    modalSkillList.appendChild(skillItem);
  });
  
  skillModal.classList.add('active'); // モーダルを表示
}

// --- モーダルを閉じる ---
function closeSkillModal() {
  skillModal.classList.remove('active');
}

// 閉じるボタンにイベントを設定
document.getElementById('modal-close-btn').addEventListener('click', closeSkillModal);


// ===============================================
// ▼▼▼ ページ遷移と初期化 ▼▼▼
// ===============================================
// (ページ遷移のコードは変更なし)
const navButtons = document.querySelectorAll('.nav-button');
// ...

updatePlayerHUD();
showPage('home-page');