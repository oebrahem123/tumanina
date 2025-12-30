/* ======================================================
   GLOBAL HELPERS (SOUND + VIBRATION)
   ====================================================== */

// صوت التسبيح
const tasbihSound = new Audio("style/assets/sounds/tap.mp3");
tasbihSound.volume = 0.5;

// تشغيل الصوت
function playTasbihSound() {
  if (localStorage.getItem("sound") !== "true") return;

  tasbihSound.currentTime = 0;
  tasbihSound.play().catch(() => {});
}

// تشغيل الاهتزاز
function vibrateTasbih() {
  if (
    localStorage.getItem("vibrate") === "true" &&
    navigator.vibrate
  ) {
    navigator.vibrate(50);
  }
}

// تشغيل الاثنين معًا
function playFeedback() {
  playTasbihSound();
  vibrateTasbih();
}

/* ======================================================
   NAVBAR
   ====================================================== */

const menu = document.querySelector(".nav-links");
const overlay = document.querySelector(".menu-overlay");
const toggleBtn = document.getElementById("menuToggle");

function openMenu() {
  menu.classList.add("active");
  overlay.classList.add("active");
  toggleBtn.innerText = "✖";
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menu.classList.remove("active");
  overlay.classList.remove("active");
  toggleBtn.innerText = "☰";
  document.body.style.overflow = "auto";
}
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMenu();
});



/* ======================================================
   NIGHT MODE
   ====================================================== */

function toggleNight() {
  document.body.classList.toggle("night");
  localStorage.setItem(
    "nightMode",
    document.body.classList.contains("night")
  );
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("nightMode") === "true") {
    document.body.classList.add("night");
  }

  // تحميل الإعدادات
  document.getElementById("soundSwitch").checked =
    localStorage.getItem("sound") === "true";

  document.getElementById("vibrateSwitch").checked =
    localStorage.getItem("vibrate") === "true";
});

document.getElementById("soundSwitch").addEventListener("change", e => {
  localStorage.setItem("sound", e.target.checked);
});

document.getElementById("vibrateSwitch").addEventListener("change", e => {
  localStorage.setItem("vibrate", e.target.checked);
});

/* ======================================================
   SETTINGS PANEL
   ====================================================== */

function openSettings() {
  document.getElementById("settingsPanel").classList.add("active");
  document.getElementById("settingsOverlay").classList.add("active");
}

function closeSettings() {
  document.getElementById("settingsPanel").classList.remove("active");
  document.getElementById("settingsOverlay").classList.remove("active");
}
/* ======================================================
   Star ابدأ التسبيح 
   ====================================================== */

function startSession() {
  document.getElementById("session").style.display = "flex";
  sessionCount = 0;
  timeLeft = 300;

  document.getElementById("sessionCount").innerText = 0;
  document.getElementById("sessionTimer").innerText = "05:00";

  startTimer();
}
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("sessionTimer").innerText =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (timeLeft <= 0) {
      endSession();
    }
  }, 1000);
}

function endSession() {
  clearInterval(timerInterval);
  document.getElementById("session").style.display = "none";
  
}

function increaseSessionCount() {
  sessionCount++;
  document.getElementById("sessionCount").innerText = sessionCount;
  playTasbihSound(); // 🔊 صوت
}

/* ======================================================
   MORNING AZKAR 
   ====================================================== */

function openMorningAzkar() {
  const section = document.getElementById("morningAzkar");
  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth" });
}

function closeMorningAzkar() {
  document.getElementById("morningAzkar").style.display = "none";
}

/* ======================================================
   EVENING AZKAR
   ====================================================== */

function openEveningAzkar() {
  const section = document.getElementById("eveningAzkar");
  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth" });
}

function closeEveningAzkar() {
  document.getElementById("eveningAzkar").style.display = "none";
}

/* ======================================================
   AZKAR COUNTER (Morning + Evening)
   ====================================================== */

function incrementZikr(btn, max) {
  const countEl = btn.previousElementSibling;
  if (!countEl) return;

  let count = Number(countEl.dataset.count || 0);

  if (count < max) {
    count++;
    countEl.dataset.count = count;
    countEl.innerText = `${count} / ${max}`;

    playFeedback(); // 🔊📳
  }

  if (count === max) {
    countEl.innerText = "✔ تم";
  }
}

/* ======================================================
   SMART COUNTER العداد الذكى 
   ====================================================== */

let smartCount = 0;

function openSmartCounter() {
  document.getElementById("smartSession").style.display = "flex";
}

function changeSmartZikr() {
  const zikr = document.getElementById("smartZikr").value;

  // تغيير نص الذكر
  document.getElementById("smartZikrText").innerText = zikr;

  // إعادة العداد للصفر
  smartCount = 0;
  document.getElementById("smartCount").innerText = 0;

  // إعادة شريط التقدم
  document.getElementById("smartProgress").style.width = "0%";
}

function closeSmart() {
  smartCount = 0;
  document.getElementById("smartCount").innerText = 0;
  document.getElementById("smartProgress").style.width = "0%";
  document.getElementById("smartSession").style.display = "none";
}

function increaseSmart() {
  const target = Number(document.getElementById("smartTarget").value);
  smartCount++;

  document.getElementById("smartCount").innerText = smartCount;
  document.getElementById("smartProgress").style.width =
    (smartCount / target) * 100 + "%";

  playFeedback();

  if (smartCount >= target) {
    alert("بارك الله فيك 🌿 وصلت للهدف");
    closeSmart();
  }
}

/* ======================================================
   TASBIH SESSION (جذء التسبيح )
   ====================================================== */

const Tasbih = {
  count: 0,
  currentZikr: "سبحان الله",

  start() {
    document.getElementById("session-sabh").style.display = "flex";
  },

  increment(btn) {
    const box = btn.closest(".session-box-sabh");
    if (!box) return;

    this.count++;
    box.querySelector(".tasbih-counter").innerText = this.count;

    playFeedback();
  },

  reset(btn) {
    const box = btn.closest(".session-box-sabh");
    if (!box) return;

    this.count = 0;
    box.querySelector(".tasbih-counter").innerText = 0;
    document.getElementById("session-sabh").style.display = "none";
  },

  changeZikr(select) {
    const box = select.closest(".session-box-sabh");
    if (!box) return;

    this.currentZikr = select.value;
    box.querySelector(".tasbih-zikr").innerText = this.currentZikr;

    this.count = 0;
    box.querySelector(".tasbih-counter").innerText = 0;
  }
};
/* ======================================================
   Start Daily Zikr Notification
   ====================================================== */
function closeZikr() {
  document.querySelector(".zikr-popup").classList.remove("active");
  document.querySelector(".zikr-overlay").classList.remove("active");
}

const azkar = [
  "سبحان الله وبحمده",
  "لا إله إلا الله",
  "استغفر الله العظيم",
  "اللهم صل وسلم على نبينا محمد"
];

function showZikrNotification() {
  const notification = document.getElementById("zikrNotification");
  const zikrText = document.getElementById("zikrText");

  const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
  zikrText.innerText = randomZikr;

  notification.classList.add("show");

  // يختفي تلقائي بعد 7 ثواني
  setTimeout(() => {
    closeZikrNotification();
  }, 7000);
}
function closeZikrNotification() {
  const notification = document.getElementById("zikrNotification");
  notification.classList.remove("show");
}
window.addEventListener("DOMContentLoaded", () => {
  showZikrNotification();
});
   
