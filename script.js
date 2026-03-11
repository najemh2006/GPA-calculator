const inputs = document.querySelectorAll('input[type="number"]');
const input4 = document.getElementById("input4");
const toggleBtn = document.getElementById("toggleBtn");
const themeToggle = document.getElementById("themeToggle");
const resultDiv = document.getElementById("result");

let hasCelebrated = false; 

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.style.display = 'none', 600);
    }
}

window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 3000); 

document.addEventListener("DOMContentLoaded", () => {
    // تحديث السنة التلقائي في الفوتر
    const yearSpan = document.getElementById("currentYear");
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    initTheme();
    loadData();
    calculate(); 
    initParticles(); 
});

function initTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
    }
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
    }
});

function initParticles() {
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#408597" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#408597", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "window",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 3 } }
            },
            retina_detect: true
        });
    }
}

inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        validateInput(input);
        saveData();
        calculate(); 
    });

    input.addEventListener("keydown", function(event) {
        if (['e', 'E', '-', '+'].includes(event.key)) {
            event.preventDefault();
        }
        if (event.key === "Enter") {
            event.preventDefault(); 
            if (index < inputs.length - 1) {
                let nextInput = inputs[index + 1];
                if (nextInput.disabled && index + 2 < inputs.length) {
                    inputs[index + 2].focus();
                } else if (!nextInput.disabled) {
                    nextInput.focus();
                }
            } else {
                input.blur(); 
            }
        }
    });

    input.addEventListener("focus", function() {
        this.select();
    });
});

function validateInput(input) {
    // إذا كان الحقل فارغاً تماماً نعتبره صالحاً (لا نعطيه لون أحمر)
    if (input.value.trim() === "") {
        input.classList.remove("invalid", "shake-error");
        return true;
    }

    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    
    if (val < min || val > max) {
        input.classList.add("invalid", "shake-error");
        setTimeout(() => input.classList.remove("shake-error"), 300);
        return false;
    }
    input.classList.remove("invalid", "shake-error");
    return true;
}

function toggleInput() {
    input4.disabled = !input4.disabled;
    if (input4.disabled) {
        input4.value = "";
        input4.classList.remove("invalid");
        toggleBtn.textContent = "تفعيل";
        toggleBtn.classList.add("active");
    } else {
        toggleBtn.textContent = "إلغاء";
        toggleBtn.classList.remove("active");
    }
    saveData();
    calculate(); 
}

function saveData() {
    const data = {
        input1: document.getElementById("input1").value,
        input2: document.getElementById("input2").value,
        input3: document.getElementById("input3").value,
        input4: input4.value,
        isInput4Disabled: input4.disabled
    };
    localStorage.setItem("gpaData", JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem("gpaData");
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById("input1").value = data.input1 || "";
        document.getElementById("input2").value = data.input2 || "";
        document.getElementById("input3").value = data.input3 || "";
        
        if (data.isInput4Disabled) {
            input4.disabled = true;
            toggleBtn.textContent = "تفعيل";
            toggleBtn.classList.add("active");
        } else {
            input4.value = data.input4 || "";
        }
    }
}

function animateValue(id, start, end, duration, isDecimal) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentVal = easeOutQuart * (end - start) + start;
        
        obj.innerHTML = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function calculate() {
    let allEmpty = true;
    let hasError = false;

    // التحقق من حالة الحقول
    inputs.forEach(input => {
        if (!input.disabled) {
            if (input.value.trim() !== "") {
                allEmpty = false;
            }
            if (input.classList.contains("invalid")) {
                hasError = true;
            }
        }
    });

    // الميزة المطلوبة: إخفاء وتفريغ النتيجة إذا كانت كل الحقول فارغة
    if (allEmpty) {
        resultDiv.classList.remove("show");
        // مسح المحتوى بعد انتهاء حركة الإخفاء (0.4 ثانية)
        setTimeout(() => {
            if (!resultDiv.classList.contains("show")) {
                resultDiv.innerHTML = "";
            }
        }, 400); 
        hasCelebrated = false; 
        return;
    }

    if (hasError) {
        resultDiv.innerHTML = `<div class="stats"><p style="color:var(--danger); text-align:center; width:100%;">الرجاء إدخال علامات صحيحة!</p></div>`;
        resultDiv.classList.add("show");
        return;
    }

    const subjects = [
        { id: "input1", max: 100 },
        { id: "input2", max: 100 },
        { id: "input3", max: 40 },
        { id: "input4", max: 60 }
    ];

    let sum = 0;
    let totalMax = 0;
    let isFail = false;

    for (const subject of subjects) {
        const input = document.getElementById(subject.id);
        if (input.disabled) continue;

        const val = parseFloat(input.value);
        const numVal = isNaN(val) ? 0 : val;
        
        sum += numVal;
        totalMax += subject.max;

        if (!isNaN(val) && val < subject.max / 2) {
            isFail = true;
        }
    }

    const finalPercentage = (sum / totalMax) * 30;
    const degrees = (finalPercentage / 30) * 360;

    let feedback = "";
    let color = "var(--primary)";
    
    if (isFail) {
        feedback = "يوجد مادة رسوب 💔";
        color = "var(--danger)";
        hasCelebrated = false;
    } else if (finalPercentage >= 27) {
        feedback = "أداء ممتاز! 🌟";
        color = "var(--success)";
        
        if (!hasCelebrated) {
            if (typeof confetti !== "undefined") {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 9999
                });
            }
            hasCelebrated = true;
        }
    } else if (finalPercentage >= 21) {
        feedback = "أداء جيد جداً 👍";
        hasCelebrated = false;
    } else {
        feedback = "تحتاج مجهود أكبر 💪";
        color = "#f39c12"; 
        hasCelebrated = false;
    }

    resultDiv.innerHTML = `
        <div class="stats">
            <p>المجموع: <strong id="sumCounter">0</strong> / ${totalMax}</p>
            <p class="feedback-msg" style="color: ${color}">${feedback}</p>
        </div>
        <div class="circular-progress" id="progressCircle" style="background: conic-gradient(${color} ${degrees}deg, var(--progress-bg) 0deg)">
            <span class="progress-value" style="color: ${color}"><span dir="ltr">%<span id="percentCounter">0.00</span></span></span>
        </div>
    `;
    resultDiv.classList.add("show");

    animateValue("sumCounter", 0, sum, 600, false);
    animateValue("percentCounter", 0, finalPercentage, 600, true);
}