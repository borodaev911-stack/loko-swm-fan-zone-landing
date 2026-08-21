// Вставьте реальные ссылки на регистрацию перед публикацией страницы.
const CHANNEL_LINKS = {
  telegram: "",
  max: "",
};

const toast = document.querySelector(".toast");
let toastTimer;

function openChannel(channel) {
  const url = CHANNEL_LINKS[channel];

  if (url) {
    window.location.href = url;
    return;
  }

  window.clearTimeout(toastTimer);
  toast.hidden = false;
  toast.classList.add("is-visible");
  toast.querySelector("span").textContent = `Добавьте ссылку для ${channel === "telegram" ? "Telegram" : "MAX"} в файле script.js.`;
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.hidden = true;
  }, 3600);
}

document.querySelectorAll("[data-channel]").forEach((button) => {
  button.addEventListener("click", () => openChannel(button.dataset.channel));
});

document.querySelectorAll("[data-scroll-registration]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".hero__registration").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

const scores = { home: 2, away: 1 };

document.querySelectorAll("[data-score]").forEach((button) => {
  button.addEventListener("click", () => {
    const team = button.dataset.score;
    const delta = Number(button.dataset.delta);
    scores[team] = Math.max(0, Math.min(9, scores[team] + delta));
    document.querySelector(`#${team}-score`).textContent = scores[team];
  });
});

const hero = document.querySelector(".hero");
const centerpiece = document.querySelector(".hero__centerpiece");

if (hero && centerpiece && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 5;
    centerpiece.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  hero.addEventListener("pointerleave", () => {
    centerpiece.style.transform = "translate3d(0, 0, 0)";
  });
}
