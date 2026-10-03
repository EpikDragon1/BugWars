// ============================================================
//  СЧЁТЧИК СКАЧИВАНИЙ
// ============================================================
// Пытается получить общий счётчик через внешний API.
// Если недоступен — использует локальный в localStorage.

const counterEl = document.getElementById("counterValue");

// Ключ, под которым хранится счётчик. Один на всю игру.
const COUNTER_KEY = "bugwars_counter_2026";

// API для счётчика. countapi.xyz — бесплатно, без регистрации.
// Если сервис не работает — откатываемся на локальный.
const COUNTER_API = `https://api.countapi.xyz/hit/bugwars-epikdragon/${COUNTER_KEY}`;

async function updateCounter() {
    try {
        // Пробуем получить значение с сервера.
        const res = await fetch(`https://api.countapi.xyz/get/bugwars-epikdragon/${COUNTER_KEY}`);
        if (res.ok) {
            const data = await res.json();
            counterEl.textContent = data.value || 0;
            return;
        }
    } catch (e) {
        // Сервер недоступен — используем локальный счётчик.
    }

    // Локальный счётчик в localStorage.
    const local = parseInt(localStorage.getItem("bugwars_downloads") || "0", 10);
    counterEl.textContent = local;
}

async function incrementCounter() {
    try {
        // Пробуем увеличить счётчик на сервере.
        const res = await fetch(COUNTER_API);
        if (res.ok) {
            const data = await res.json();
            counterEl.textContent = data.value || 0;
            return;
        }
    } catch (e) {
        // Сервер недоступен.
    }

    // Локальный инкремент.
    const local = parseInt(localStorage.getItem("bugwars_downloads") || "0", 10) + 1;
    localStorage.setItem("bugwars_downloads", local);
    counterEl.textContent = local;
}

// Обновляем счётчик при загрузке страницы.
updateCounter();

// Вешаем на кнопки скачивания инкремент.
document.getElementById("downloadExe").addEventListener("click", () => {
    setTimeout(incrementCounter, 100);
});

document.getElementById("downloadZip").addEventListener("click", () => {
    setTimeout(incrementCounter, 100);
});

// ============================================================
//  МАТРИЦА НА ФОНЕ
// ============================================================
// Лёгкий эффект "падающих символов". Не тормозит.

const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");

let columns = [];
const FONT_SIZE = 14;
const CHARS = "01アイウエオカキクケコ{}[]()<>/*+-=;!?#$%&@".split("");

function resizeMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colCount = Math.floor(canvas.width / FONT_SIZE);
    columns = new Array(colCount).fill(0).map(() => Math.random() * canvas.height);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(10, 10, 18, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#4ade80";
    ctx.font = FONT_SIZE + "px monospace";

    for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = columns[i];

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            columns[i] = 0;
        }
        columns[i] += FONT_SIZE * 0.5;
    }
}

resizeMatrix();
window.addEventListener("resize", resizeMatrix);
setInterval(drawMatrix, 50);   // ~20 fps — не грузит

// ============================================================
//  ФОРМА ОБРАТНОЙ СВЯЗИ (Web3Forms)
// ============================================================
// Web3Forms — бесплатный сервис, который принимает данные
// с формы и отправляет их на email. Работает без сервера.

const form = document.getElementById("contactForm");
const successMsg = document.getElementById("formSuccess");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        // Отправляем на сервер Web3Forms.
        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            successMsg.style.display = "block";
            form.reset();
            setTimeout(() => {
                successMsg.style.display = "none";
            }, 5000);
        } else {
            alert("Ошибка: " + (data.message || "не удалось отправить"));
        }
    } catch (err) {
        alert("Не удалось отправить. Проверь интернет и попробуй позже.");
    }
});

// ============================================================
//  ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id === "#") return;
        const el = document.querySelector(id);
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});
