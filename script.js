const pages = [...document.querySelectorAll(".page")];
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicPill = document.getElementById("musicPill");
const musicStatus = document.getElementById("musicStatus");

let currentPage = 0;
let musicStarted = false;

function showPage(id) {
  const target = document.getElementById(id);
  if (!target) return;

  pages.forEach(page => page.classList.remove("active"));
  target.classList.add("active");
  currentPage = pages.indexOf(target);
  target.scrollTo({ top: 0, behavior: "instant" });

  // Re-trigger lily animation every time page 2 is opened.
  if (id === "page2") {
    document.querySelectorAll(".lily").forEach(lily => {
      lily.style.animation = "none";
      void lily.offsetWidth;
      lily.style.animation = "";
    });
  }
}

async function startMusic() {
  if (musicStarted) return;
  try {
    await music.play();
    musicStarted = true;
    musicPill.classList.remove("paused");
    musicStatus.textContent = "music on";
  } catch (err) {
    musicStatus.textContent = "tap ♪";
  }
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", async () => {
    await startMusic();
    showPage(btn.dataset.next);
  });
});

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicPill.classList.remove("paused");
      musicStatus.textContent = "music on";
    } catch (err) {}
  } else {
    music.pause();
    musicPill.classList.add("paused");
    musicStatus.textContent = "music off";
  }
});

document.getElementById("replayBtn").addEventListener("click", () => {
  showPage("page1");
  music.currentTime = 0;
  startMusic();
});

// Gentle keyboard navigation for desktop.
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" && currentPage < pages.length - 1) {
    showPage(pages[currentPage + 1].id);
  }
  if (e.key === "ArrowLeft" && currentPage > 0) {
    showPage(pages[currentPage - 1].id);
  }
});

// Try to preload the audio without forcing playback.
music.load();
