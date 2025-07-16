let gameSeq = [];
let userSeq = [];
let level = 0;
let start = false;
const colors = ["yellow", "green", "red", "purple"];

const h2 = document.querySelector('h2');
const h3 = document.querySelector('h3');
const input = document.getElementById("startInput");
const rulesBox = document.getElementById("rulesBox"); // 📜 rules div

// Load highest score on page load
window.addEventListener('load', async () => {
  try {
    const res = await fetch('/simongame/score');
    const data = await res.json();
    document.getElementById('highScore').innerText = data.highScore;
  } catch (err) {
    console.error("Failed to load high score", err);
  }
});

// Start game when user types anything (works on mobile)
input.addEventListener("input", () => {
  if (!start && input.value.trim().length > 0) {
    startGame();
  }
});

function startGame() {
  start = true;
  input.classList.add("hidden");
  input.blur();              // hide mobile keyboard
  input.value = "";          // clear input field
  rulesBox.style.display = "none"; // hide rules 📜
  levelUp();
}

function levelUp() {
  userSeq = [];
  h2.innerText = `Level ${level}`;
  const randColor = colors[Math.floor(Math.random() * 4)];
  gameSeq.push(randColor);
  flash(document.querySelector(`#${randColor}`));
  level++;
}

function flash(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 300);
}

function btnPress() {
  if (!start) return;
  const btn = this;
  const color = btn.id;
  userSeq.push(color);
  userFlash(btn);
  checkAns(userSeq.length - 1);
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    h2.innerHTML = `Game Over! Your Score: <b>${level - 1}</b><br>Type to restart.`;
    document.body.style.backgroundColor = 'red';
    setTimeout(() => document.body.style.backgroundColor = 'white', 1000);
    sendHighScore(level - 1);
    reset();
  }
}

function reset() {
  start = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  input.classList.remove("hidden");
  setTimeout(() => input.focus(), 300);
  rulesBox.style.display = "block"; // show rules again
}

async function sendHighScore(score) {
  try {
    const res = await fetch('/simongame/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score })
    });
    const data = await res.json();
    document.getElementById('highScore').innerText = data.highScore;
  } catch (err) {
    console.error("Failed to send score", err);
  }
}

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", btnPress);
});
