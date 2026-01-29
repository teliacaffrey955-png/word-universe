// ===== 全局变量 =====
let wordsData = []; // 存储单词数据
let currentWordIndex = 0;
let userData = {
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
    mastered: JSON.parse(localStorage.getItem('mastered')) || [],
    streak: parseInt(localStorage.getItem('streak')) || 0,
    lastVisit: localStorage.getItem('lastVisit') || null
};

// ===== DOM元素 =====
const elements = {
    // 页面
    welcomePage: document.getElementById('welcomePage'),
    wordDetailPage: document.getElementById('wordDetailPage'),
    
    // 单词列表
    wordList: document.getElementById('wordList'),
    wordCount: document.getElementById('wordCount'),
    
    // 单词详情
    currentWord: document.getElementById('currentWord'),
    currentPhonetic: document.getElementById('currentPhonetic'),
    currentPart: document.getElementById('currentPart'),
    currentDifficulty: document.getElementById('currentDifficulty'),
    currentMetaphor: document.getElementById('currentMetaphor'),
    coreDescription: document.getElementById('coreDescription'),
    coreGameText: document.getElementById('coreGameText'),
    
    // 按钮
    startExploring: document.getElementById('startExploring'),
    backToList: document.getElementById('backToList'),
    prevWord: document.getElementById('prevWord'),
    nextWord: document.getElementById('nextWord'),
    toggleFavorite: document.getElementById('toggleFavorite'),
    playAudio: document.getElementById('playAudio'),
    shareWord: document.getElementById('shareWord'),
    
    // 搜索
    searchToggle: document.getElementById('searchToggle'),
    searchBar: document.getElementById('searchBar'),
    wordSearch: document.getElementById('wordSearch'),
    clearSearch: document.getElementById('clearSearch'),
    
    // 主题和字体
    themeToggle: document.getElementById('themeToggle'),
    fontSizeBtn: document.getElementById('fontSizeBtn'),
    fontSizePanel: document.getElementById('fontSizePanel'),
    
    // 侧边栏
    sidebar: document.getElementById('sidebar'),
    toggleSidebar: document.getElementById('toggleSidebar'),
    
    // 进度
    toggleProgress: document.getElementById('toggleProgress'),
    progressContent: document.querySelector('.progress-content'),
    masteredCount: document.getElementById('masteredCount'),
    streakDays: document.getElementById('streakDays'),
    totalPoints: document.getElementById('totalPoints'),
    recentWordsList: document.getElementById('recentWordsList'),
    
    // 通知
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notificationText')
};

// ===== 初始化函数 =====
async function init() {
    await loadWordsData();
    setupEventListeners();
    updateUserStreak();
    updateProgressPanel();
    renderWordList();
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const wordParam = urlParams.get('word');
    if (wordParam) {
        const wordIndex = wordsData.findIndex(w => w.id === wordParam.toLowerCase());
        if (wordIndex !== -1) {
            showWordDetail(wordIndex);
        }
    }
}

async function loadWordsData() {
    try {
        // 从words.json加载数据
        const response = await fetch('words.json');
        wordsData = await response.json();
        
        // 如果没有words.json文件，使用默认数据
        if (!wordsData || wordsData.length === 0) {
            wordsData = getDefaultWordsData();
        }
    } catch (error) {
        console.error('加载单词数据失败:', error);
        wordsData = getDefaultWordsData();
    }
}

function getDefaultWordsData() {
    return [
        {
            id: "thanks",
            word: "Thanks",
            phonetic: "/θæŋks/",
            partOfSpeech: ["感叹词"],
            difficulty: 1,
            tags: ["社交", "日常", "初级"],
            coreMetaphor: "人情小账本",
            introduction: "这不是普通的'谢谢'，这是你心里的人情小账本！",
            sections: {
                coreGame: "别人帮你 → 账本记一笔（+1）\n你说Thanks → 账本划一笔（-1）\n不说Thanks → 账本一直欠着 😠",
                chessboards: {
                    school: {
                        title: "借橡皮风云",
                        scene: "数学课，你没带橡皮",
                        dialogues: [
                            { speaker: "你", text: "橡皮借我一下？" },
                            { speaker: "同桌", text: "给。" }
                        ],
                        choices: [
                            { text: "❌ 不说话，直接拿", result: "同桌内心OS：'又白借，下次不借了！' 关系值-5" },
                            { text: "✅ Thanks!", result: "同桌微笑：'没事~' 关系值+10" }
                        ],
                        explanation: "选'Thanks!' → 人情账本清零，友谊值+10 👍"
                    },
                    life: {
                        title: "早餐感谢学",
                        scene: "周一早上，妈妈做早餐",
                        dialogues: [
                            { speaker: "妈妈", text: "快点吃，要迟到了！" }
                        ],
                        choices: [
                            { text: "❌ 埋头吃：'嗯。'", result: "妈妈内心：'这孩子，连句谢谢都不会说...'" },
                            { text: "✅ 'Thanks, mom! 超好吃！'", result: "妈妈开心：'喜欢就好~' 家庭和谐度+10086" }
                        ],
                        explanation: "说Thanks时加眼神接触效果×2，加微笑效果×3，加具体内容效果×5！"
                    }
                },
                memoryTip: {
                    draw: "画一个小账本📒，左边'+'号栏（别人帮你），右边'-'号栏（你说Thanks），中间画'清零线'",
                    rap: "你是我的小呀小账本\n怎么清零都不嫌多\n小小的帮助记上一笔\n说声Thanks就划掉它\n温暖你的心窝\n点亮友谊的火 火火火火",
                    game: "今日任务：记录3次别人帮你的情况，都说Thanks让账本清零！"
                },
                warnings: [
                    {
                        title: "用错'货币'",
                        description: "小帮助用小Thanks，大恩情用大感谢",
                        example: "朋友帮你挡篮球 → 要说'Thank you SO much!'",
                        icon: "💰"
                    },
                    {
                        title: "忘记'找零'",
                        description: "别人对你说Thanks，必须回应",
                        example: "正确回应：'You're welcome!' 或 'No problem!'",
                        icon: "🔄"
                    },
                    {
                        title: "讽刺语气",
                        description: "讽刺的Thanks比不说更伤人",
                        example: "（翻白眼）'Thanks a LOT!' → 关系值-100",
                        icon: "🎭"
                    }
                ]
            },
            relatedWords: ["thank you", "appreciate", "gratitude"]
        },
        {
            id: "come",
            word: "Come",
            phonetic: "/kʌm/",
            partOfSpeech: ["动词"],
            difficulty: 2,
            tags: ["动作", "方向", "中级"],
            coreMetaphor: "磁铁召唤术",
            introduction: "这不是普通的'来'，这是磁铁召唤术！",
            sections: {
                coreGame: "你说come = 变成磁铁\n对方 = 被吸过来的铁东西",
                chessboards: {
                    school: {
                        title: "课堂点名",
                        scene: "英语课上，老师点名",
                        dialogues: [
                            { speaker: "老师", text: "Please come to the blackboard." }
                        ],
                        choices: [
                            { text: "❌ 坐着不动", result: "老师生气，课堂表现-10" },
                            { text: "✅ 站起来走过去", result: "老师满意，课堂表现+10" }
                        ],
                        explanation: "老师=磁铁中心，向着说话人移动就用come"
                    }
                },
                warnings: [
                    {
                        title: "电话里的视角错位",
                        description: "向着对方移动必须用come，不能用go",
                        example: "❌ 'I'm going to your house.'\n✅ 'I'm coming to your house.'",
                        icon: "📞"
                    }
                ]
            }
        },
        {
            id: "of",
            word: "Of",
            phonetic: "/ʌv, əv/",
            partOfSpeech: ["介词"],
            difficulty: 3,
            tags: ["关系", "连接", "中级"],
            coreMetaphor: "万能胶水",
            introduction: "这不是普通的'的'，这是万能胶水！",
            sections: {
                coreGame: "A of B = 用胶水把A和B粘在一起"
            }
        }
    ];
}

// ===== 事件监听器设置 =====
function setupEventListeners() {
    // 开始探索按钮
    elements.startExploring.addEventListener('click', () => {
        showWordDetail(0);
    });
    
    // 返回列表按钮
    elements.backToList.addEventListener('click', showWordList);
    
    // 上一个/下一个单词
    elements.prevWord.addEventListener('click', () => {
        showWordDetail((currentWordIndex - 1 + wordsData.length) % wordsData.length);
    });
    
    elements.nextWord.addEventListener('click', () => {
        showWordDetail((currentWordIndex + 1) % wordsData.length);
    });
    
    // 收藏按钮
    elements.toggleFavorite.addEventListener('click', toggleFavorite);
    
    // 发音按钮
    elements.playAudio.addEventListener('click', playWordAudio);
    
    // 分享按钮
    elements.shareWord.addEventListener('click', shareWord);
    
    // 搜索功能
    elements.searchToggle.addEventListener('click', toggleSearch);
    elements.wordSearch.addEventListener('input', searchWords);
    elements.clearSearch.addEventListener('click', clearSearch);
    
    // 主题切换
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // 字体大小
    elements.fontSizeBtn.addEventListener('click', toggleFontSizePanel);
    document.addEventListener('click', closeFontSizePanel);
    
    // 侧边栏切换
    elements.toggleSidebar.addEventListener('click', toggleSidebar);
    
    // 进度面板
    elements.toggleProgress.addEventListener('click', toggleProgressPanel);
    
    // 卡片翻转
    document.addEventListener('click', function(e) {
        if (e.target.closest('.flip-btn')) {
            const card = e.target.closest('.core-card');
            card.classList.toggle('flipped');
        }
    });
    
    // 场景切换
    document.addEventListener('click', function(e) {
        if (e.target.closest('.scene-tab')) {
            const tab = e.target.closest('.scene-tab');
            const scene = tab.dataset.scene;
            switchScene(scene);
        }
    });
    
    // 选择按钮
    document.addEventListener('click', function(e) {
        if (e.target.closest('.choice-btn')) {
            const choice = e.target.closest('.choice-btn');
            showChoiceResult(choice);
        }
    });
    
    // 画布功能
    setupCanvas();
    
    // 快速开始单词
    document.addEventListener('click', function(e) {
        if (e.target.closest('.word-chip')) {
            const chip = e.target.closest('.word-chip');
            const wordId = chip.dataset.word;
            const wordIndex = wordsData.findIndex(w => w.id === wordId);
            if (wordIndex !== -1) {
                showWordDetail(wordIndex);
            }
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ===== 核心功能函数 =====
function renderWordList() {
    elements.wordList.innerHTML = '';
    elements.wordCount.textContent = `${wordsData.length}个单词`;
    
    wordsData.forEach((word, index) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        if (index === currentWordIndex) {
            wordItem.classList.add('active');
        }
        
        wordItem.innerHTML = `
            <div class="word-text">${word.word}</div>
            <div class="word-metaphor">${word.coreMetaphor}</div>
        `;
        
        wordItem.addEventListener('click', () => {
            showWordDetail(index);
        });
        
        elements.wordList.appendChild(wordItem);
    });
}

function showWordDetail(index) {
    currentWordIndex = index;
    const word = wordsData[index];
    
    // 更新URL（不刷新页面）
    const url = new URL(window.location);
    url.searchParams.set('word', word.id);
    window.history.pushState({}, '', url);
    
    // 切换到详情页
    elements.welcomePage.classList.remove('active');
    elements.wordDetailPage.style.display = 'block';
    
    // 更新单词信息
    elements.currentWord.textContent = word.word;
    elements.currentPhonetic.textContent = word.phonetic;
    elements.currentPart.textContent = word.partOfSpeech.join(' · ');
    elements.currentDifficulty.textContent = '★'.repeat(word.difficulty) + '☆'.repeat(5 - word.difficulty);
    elements.currentMetaphor.textContent = word.coreMetaphor;
    elements.coreDescription.innerHTML = word.introduction;
    elements.coreGameText.innerHTML = word.sections.coreGame.replace(/\n/g, '<br>');
    
    // 更新收藏按钮状态
    updateFavoriteButton();
    
    // 渲染场景
    renderScenes(word);
    
    // 渲染记忆魔法
    renderMemoryTools(word);
    
    // 渲染避坑指南
    renderWarnings(word);
    
    // 更新单词列表高亮
    updateWordListHighlight();
    
    // 添加到最近查看
    addToRecentlyViewed(word.id);
    
    // 更新进度面板
    updateProgressPanel();
    
    // 关闭侧边栏（移动端）
    if (window.innerWidth < 768) {
        elements.sidebar.classList.remove('active');
    }
}

function showWordList() {
    elements.welcomePage.classList.add('active');
    elements.wordDetailPage.style.display = 'none';
    
    // 清空URL参数
    const url = new URL(window.location);
    url.searchParams.delete('word');
    window.history.pushState({}, '', url);
}

function updateFavoriteButton() {
    const wordId = wordsData[currentWordIndex].id;
    const isFavorite = userData.favorites.includes(wordId);
    
    const icon = elements.toggleFavorite.querySelector('i');
    if (isFavorite) {
        icon.className = 'fas fa-star';
        elements.toggleFavorite.style.color = '#FFB74D';
    } else {
        icon.className = 'far fa-star';
        elements.toggleFavorite.style.color = '';
    }
}

function toggleFavorite() {
    const wordId = wordsData[currentWordIndex].id;
    const index = userData.favorites.indexOf(wordId);
    
    if (index === -1) {
        userData.favorites.push(wordId);
        showNotification('已添加到收藏');
    } else {
        userData.favorites.splice(index, 1);
        showNotification('已取消收藏');
    }
    
    localStorage.setItem('favorites', JSON.stringify(userData.favorites));
    updateFavoriteButton();
}

function playWordAudio() {
    const word = wordsData[currentWordIndex].word;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
}

function shareWord() {
    const word = wordsData[currentWordIndex];
    const shareText = `我发现了一个超有趣的单词解读：${word.word} - ${word.coreMetaphor}\n\n来自「单词宇宙」🔍`;
    
    if (navigator.share) {
        navigator.share({
            title: `${word.word} - 单词宇宙`,
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText + '\n' + window.location.href);
        showNotification('分享链接已复制到剪贴板');
    }
}

function toggleSearch() {
    elements.searchBar.classList.toggle('hidden');
    if (!elements.searchBar.classList.contains('hidden')) {
        elements.wordSearch.focus();
    }
}

function searchWords() {
    const query = elements.wordSearch.value.toLowerCase().trim();
    if (query === '') {
        renderWordList();
        return;
    }
    
    const filteredWords = wordsData.filter(word => 
        word.word.toLowerCase().includes(query) ||
        word.coreMetaphor.toLowerCase().includes(query) ||
        word.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    elements.wordList.innerHTML = '';
    elements.wordCount.textContent = `找到${filteredWords.length}个结果`;
    
    filteredWords.forEach((word, index) => {
        const originalIndex = wordsData.findIndex(w => w.id === word.id);
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        
        wordItem.innerHTML = `
            <div class="word-text">${word.word}</div>
            <div class="word-metaphor">${word.coreMetaphor}</div>
        `;
        
        wordItem.addEventListener('click', () => {
            showWordDetail(originalIndex);
            elements.searchBar.classList.add('hidden');
            elements.wordSearch.value = '';
        });
        
        elements.wordList.appendChild(wordItem);
    });
}

function clearSearch() {
    elements.wordSearch.value = '';
    renderWordList();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = elements.themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    showNotification(`已切换到${newTheme === 'dark' ? '暗色' : '亮色'}模式`);
}

function toggleFontSizePanel(e) {
    e.stopPropagation();
    elements.fontSizePanel.classList.toggle('hidden');
}

function closeFontSizePanel(e) {
    if (!elements.fontSizePanel.contains(e.target) && !elements.fontSizeBtn.contains(e.target)) {
        elements.fontSizePanel.classList.add('hidden');
    }
}

function toggleSidebar() {
    elements.sidebar.classList.toggle('active');
    
    const icon = elements.toggleSidebar.querySelector('i');
    if (elements.sidebar.classList.contains('active')) {
        icon.style.transform = 'rotate(0deg)';
    } else {
        icon.style.transform = window.innerWidth < 768 ? 'rotate(90deg)' : 'rotate(180deg)';
    }
}

function toggleProgressPanel() {
    elements.progressContent.classList.toggle('hidden');
}

function updateProgressPanel() {
    elements.masteredCount.textContent = userData.mastered.length;
    elements.streakDays.textContent = userData.streak;
    elements.totalPoints.textContent = userData.favorites.length * 10 + userData.mastered.length * 50;
    
    // 更新最近学习
    elements.recentWordsList.innerHTML = '';
    userData.recentlyViewed.slice(-5).forEach(wordId => {
        const word = wordsData.find(w => w.id === wordId);
        if (word) {
            const span = document.createElement('span');
            span.className = 'recent-word';
            span.textContent = word.word;
            elements.recentWordsList.appendChild(span);
        }
    });
}

function updateUserStreak() {
    const today = new Date().toDateString();
    
    if (userData.lastVisit) {
        const lastVisit = new Date(userData.lastVisit);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisit.toDateString() === yesterday.toDateString()) {
            userData.streak++;
        } else if (lastVisit.toDateString() !== today) {
            userData.streak = 1;
        }
    } else {
        userData.streak = 1;
    }
    
    userData.lastVisit = today;
    localStorage.setItem('lastVisit', today);
    localStorage.setItem('streak', userData.streak.toString());
}

function addToRecentlyViewed(wordId) {
    const index = userData.recentlyViewed.indexOf(wordId);
    if (index !== -1) {
        userData.recentlyViewed.splice(index, 1);
    }
    userData.recentlyViewed.push(wordId);
    
    // 只保留最近10个
    if (userData.recentlyViewed.length > 10) {
        userData.recentlyViewed.shift();
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(userData.recentlyViewed));
}

function updateWordListHighlight() {
    document.querySelectorAll('.word-item').forEach((item, index) => {
        if (index === currentWordIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ===== 场景相关函数 =====
function renderScenes(word) {
    // 学校场景
    const schoolScene = document.getElementById('schoolScene');
    if (word.sections.chessboards?.school) {
        const scene = word.sections.chessboards.school;
        schoolScene.querySelector('.scene-title').textContent = scene.title;
        
        const dialogueHTML = scene.dialogues.map(d => `
            <div class="dialogue-bubble ${d.speaker === '你' ? 'left' : 'right'}">
                <span class="speaker">${d.speaker}</span>
                <p>${d.text}</p>
            </div>
        `).join('');
        
        const choicesHTML = scene.choices.map(c => `
            <button class="choice-btn ${c.text.includes('❌') ? 'bad-choice' : 'good-choice'}">
                ${c.text}
            </button>
        `).join('');
        
        schoolScene.querySelector('.scene-dialogue').innerHTML = `
            ${dialogueHTML}
            <div class="dialogue-choice">
                <p>你的选择：</p>
                <div class="choices">
                    ${choicesHTML}
                </div>
            </div>
        `;
        
        schoolScene.querySelector('.scene-explanation').textContent = scene.explanation;
    }
}

function switchScene(scene) {
    // 更新标签
    document.querySelectorAll('.scene-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.scene === scene);
    });
    
    // 更新内容
    document.querySelectorAll('.scene-content').forEach(content => {
        content.classList.toggle('active', content.id === `${scene}Scene`);
    });
}

function showChoiceResult(choice) {
    const sceneCard = choice.closest('.scene-card');
    const explanation = sceneCard.querySelector('.scene-explanation');
    
    if (choice.classList.contains('good-choice')) {
        explanation.style.borderLeftColor = '#00C896';
        showNotification('👍 选择正确！社交分+10');
    } else {
        explanation.style.borderLeftColor = '#FF4757';
        showNotification('❌ 选择错误，再试试看！');
    }
    
    explanation.style.opacity = '0';
    setTimeout(() => {
        explanation.style.opacity = '1';
        explanation.style.transition = 'opacity 0.3s';
    }, 10);
}

// ===== 记忆魔法相关函数 =====
function renderMemoryTools(word) {
    if (word.sections.memoryTip) {
        const tip = word.sections.memoryTip;
        
        // 画出来
        if (tip.draw) {
            document.getElementById('drawInstruction').textContent = tip.draw;
        }
        
        // 唱出来
        if (tip.rap) {
            document.getElementById('rapLyrics').innerHTML = tip.rap.replace(/\n/g, '<br>');
        }
        
        // 玩出来
        if (tip.game) {
            document.getElementById('gameInstructions').textContent = tip.game;
        }
    }
}

function setupCanvas() {
    const canvas = document.getElementById('memoryCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#FF6B9D';
    
    // 设置画布背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 触摸事件（移动端）
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    // 颜色按钮
    document.querySelectorAll('.draw-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentColor = btn.dataset.color;
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });
    
    // 清除按钮
    document.getElementById('clearCanvas').addEventListener('click', () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    function startDrawing(e) {
        drawing = true;
        const { x, y } = getCoordinates(e);
        [lastX, lastY] = [x, y];
    }
    
    function draw(e) {
        if (!drawing) return;
        
        const { x, y } = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        drawing = false;
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        
        if (e.type === 'touchstart') {
            startDrawing(mouseEvent);
        } else if (e.type === 'touchmove') {
            draw(mouseEvent);
        }
    }
    
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        return { x, y };
    }
}

// ===== 避坑指南 =====
function renderWarnings(word) {
    const container = document.querySelector('.warning-cards');
    container.innerHTML = '';
    
    if (word.sections.warnings) {
        word.sections.warnings.forEach(warning => {
            const card = document.createElement('div');
            card.className = 'warning-card';
            card.innerHTML = `
                <h4><i class="fas fa-exclamation-triangle"></i> ${warning.title}</h4>
                <p>${warning.description}</p>
                <div class="warning-example">
                    <strong>示例：</strong> ${warning.example}
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// ===== 工具函数 =====
function showNotification(message, duration = 3000) {
    elements.notificationText.textContent = message;
    elements.notification.classList.remove('hidden');
    
    setTimeout(() => {
        elements.notification.classList.add('hidden');
    }, duration);
}

function handleKeyboardShortcuts(e) {
    // 左右箭头切换单词
    if (e.key === 'ArrowLeft' && !elements.wordDetailPage.classList.contains('hidden')) {
        e.preventDefault();
        elements.prevWord.click();
    } else if (e.key === 'ArrowRight' && !elements.wordDetailPage.classList.contains('hidden')) {
        e.preventDefault();
        elements.nextWord.click();
    }
    
    // ESC返回列表
    if (e.key === 'Escape' && !elements.wordDetailPage.classList.contains('hidden')) {
        elements.backToList.click();
    }
    
    // Ctrl+F搜索
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleSearch();
    }
}

// ===== 初始化字体大小 =====
function initFontSize() {
    const savedSize = localStorage.getItem('fontSize') || 'medium';
    document.body.classList.add(`font-${savedSize}`);
    
    document.querySelectorAll('.font-option').forEach(option => {
        option.classList.toggle('active', option.dataset.size === savedSize);
        option.addEventListener('click', () => {
            const size = option.dataset.size;
            document.body.className = document.body.className.replace(/font-\w+/g, '');
            document.body.classList.add(`font-${size}`);
            localStorage.setItem('fontSize', size);
            
            document.querySelectorAll('.font-option').forEach(opt => {
                opt.classList.toggle('active', opt === option);
            });
            
            showNotification(`字体大小已切换为${size === 'small' ? '小' : size === 'medium' ? '中' : '大'}`);
        });
    });
}

// ===== 初始化主题 =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = elements.themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== 页面加载完成 =====
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFontSize();
    init();
});

// 处理前进/后退按钮
window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const wordParam = urlParams.get('word');
    
    if (wordParam) {
        const wordIndex = wordsData.findIndex(w => w.id === wordParam.toLowerCase());
        if (wordIndex !== -1) {
            showWordDetail(wordIndex);
        }
    } else {
        showWordList();
    }
});