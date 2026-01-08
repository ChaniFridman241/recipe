
let recipes = [
    { id: 1, title: "פסטה רוזה ביתית", ingredients: "פסטה, שמנת מתוקה, רסק עגבניות, מלח, בזיליקום", steps: "מבשלים פסטה. במחבת נפרדת מערבבים שמנת ורסק, מוסיפים תבלינים, מאחדים ומגישים חם." },
    { id: 2, title: "סלט בריאות מרענן", ingredients: "קינואה, חמוציות, שקדים, פטרוזיליה, מיץ לימון", steps: "מבשלים את הקינואה ומקררים. קוצצים את הפטרוזיליה, מערבבים את כל הרכיבים ומתבלים." },
    { id: 3, title: "מוס שוקולד אוורירי", ingredients: "200 גרם שוקולד מריר, 1 מיכל שמנת מתוקה, 3 ביצים, מעט סוכר", steps: "ממיסים את השוקולד. מקציפים שמנת בנפרד וחלבונים בנפרד. מאחדים הכל בתנועות קיפול ומקררים ל-4 שעות." },
    { id: 4, title: "מרק כתומים עשיר", ingredients: "דלעת, בטטה, גזר, בצל, קרם קוקוס, מלח, פלפל, כורכום", steps: "מטגנים בצל, מוסיפים ירקות חתוכים ומים עד כיסוי. מבשלים עד ריכוך, טוחנים ומוסיפים קרם קוקוס ותבלינים." },
    { id: 5, title: "פוקאצ'ה שום ורוזמרין", ingredients: "חצי קילו קמח, כף שמרים, כף סוכר, כוס וחצי מים, שמן זית, שום כתוש, רוזמרין", steps: "לשים בצק ומתפיחים שעה. משטחים בתבנית, יוצרים גומחות, מורחים שמן זית ושום, מפזרים רוזמרין ואופים ב-220 מעלות." },
    { id: 6, title: "מוקפץ ירקות ונודלס", ingredients: "נודלס, גזר, פלפל, בצל, כרוב, סויה, סילאן, ג'ינג'ר", steps: "מבשלים נודלס. מקפיצים ירקות בווק עם מעט שמן, מוסיפים את הרוטב והנודלס, מערבבים דקה ומגישים." },
   ];

//    function loadSettings() {
//     const theme = localStorage.getItem('theme') || 'dark-mode';
//     const rate = localStorage.getItem('speech-rate') || '1';
    
//     document.body.className = theme;
//     document.getElementById('speech-rate').value = rate;
// }
// window.onload = loadSettings;

const synth = window.speechSynthesis;


function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function markError(id, msg) {
    const el = document.getElementById(id);
    el.classList.add('input-error');
    el.value = '';
    el.placeholder = msg;
    el.oninput = () => el.classList.remove('input-error');
}

function navigateTo(pageId) {
    synth.cancel(); 
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if(target) target.classList.add('active');
    
    // סגירת מודאלים בניווט
    hideSettings();
    hideAddRecipe();
    
    if(pageId === 'main-page') renderRecipes(recipes);
}

// --- משתמשים ---
function login() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const regBtn = document.getElementById('register-btn');
    
    if(!u || !p) {
        showToast("נא למלא שם וסיסמה");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(user => user.username === u);

    if(foundUser) {
        if(foundUser.password === p) {
            showToast("ברוכה הבאה!");
            navigateTo('main-page');
            regBtn.style.display = 'none';
        } else {
            markError('password', 'סיסמה שגויה');
        }
    } else {
        showToast("שם משתמש לא נמצא. ניתן להירשם");
        regBtn.style.display = 'block'; 
    }
}

function register() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(!u || !p) return;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({username: u, password: p});
    localStorage.setItem('users', JSON.stringify(users));
    showToast("נרשמת בהצלחה!");
    navigateTo('main-page');
}

// --- מתכונים ---
function renderRecipes(data) {
    const list = document.getElementById('recipe-list');
    list.innerHTML = data.map(r => `
        <div class="glass-card" onclick="viewRecipe(${r.id})" style="cursor:pointer; text-align:center;">
            <h3 class="neon-text">${r.title}</h3>
            <p style="font-size:0.9rem; opacity:0.7">לחצי לצפייה והקראה</p>
        </div>
    `).join('');
}

function viewRecipe(id) {
    const r = recipes.find(item => item.id === id);
    document.getElementById('detail-title').innerText = r.title;
    document.getElementById('detail-ingredients').innerHTML = r.ingredients.split(',').map(i => `<li>${i.trim()}</li>`).join('');
    document.getElementById('detail-steps').innerText = r.steps;
    navigateTo('recipe-detail-page');
}

function showAddRecipe() { document.getElementById('add-recipe-modal').style.display = 'flex'; }
function hideAddRecipe() { document.getElementById('add-recipe-modal').style.display = 'none'; }

function saveNewRecipe() {
    const t = document.getElementById('new-recipe-title');
    const i = document.getElementById('new-recipe-ingredients');
    const s = document.getElementById('new-recipe-steps');
    if(!t.value) return markError('new-recipe-title', 'תני שם למנה');
    recipes.push({ id: Date.now(), title: t.value, ingredients: i.value, steps: s.value });
    renderRecipes(recipes);
    hideAddRecipe();
    showToast("המתכון נשמר!");
}

// --- הגדרות ---
function showSettings() { document.getElementById('settings-modal').style.display = 'flex'; }
function hideSettings() { 
    document.getElementById('settings-modal').style.display = 'none'; }

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

// --- הקראה ---
function startSpeaking() {
    const title = document.getElementById('detail-title').innerText;
    const steps = document.getElementById('detail-steps').innerText;
    const ingredientsList = document.getElementById('detail-ingredients');
    const ingredientsText = Array.from(ingredientsList.querySelectorAll('li')).map(li => li.innerText).join(', ');

    const text = `מתכון עבור ${title}. המצרכים הם: ${ingredientsText}. אופן ההכנה: ${steps}`;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'he-IL';
    utter.rate = document.getElementById('speech-rate').value;
    synth.speak(utter);
}

function pauseSpeaking() { synth.pause(); }
function resumeSpeaking() { synth.resume(); }
function stopSpeaking() { synth.cancel(); }

function filterRecipes() {
    const term = document.getElementById('search-input').value.toLowerCase();
    renderRecipes(recipes.filter(r => r.title.toLowerCase().includes(term)));
}