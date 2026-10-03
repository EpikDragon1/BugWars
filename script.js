// ============================================================
//  МАТРИЦА НА ФОНЕ
// ============================================================

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
setInterval(drawMatrix, 50);

// ============================================================
//  ФОРМА ОБРАТНОЙ СВЯЗИ (Web3Forms)
// ============================================================

const form = document.getElementById("contactForm");
const successMsg = document.getElementById("formSuccess");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                if (successMsg) {
                    successMsg.style.display = "block";
                    setTimeout(() => {
                        successMsg.style.display = "none";
                    }, 5000);
                }
                form.reset();
            } else {
                alert("Ошибка: " + (data.message || "не удалось отправить"));
            }
        } catch (err) {
            alert("Не удалось отправить. Проверь интернет и попробуй позже.");
        }
    });
}

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
