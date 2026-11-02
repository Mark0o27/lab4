document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Адаптивне меню (бургер) ---------- */
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");

    function closeMenu() {
        burger.classList.remove("open");
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
    }

    burger.addEventListener("click", function () {
        const isOpen = menu.classList.toggle("open");
        burger.classList.toggle("open", isOpen);
        burger.setAttribute("aria-expanded", isOpen);
    });

    // Закриваємо меню після вибору пункту
    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    /* ---------- Модальне вікно Sign in ---------- */
    const modal = document.getElementById("authModal");
    const signInBtn = document.getElementById("signInBtn");
    const modalClose = document.getElementById("modalClose");

    function openModal() {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        closeMenu();
        const firstInput = modal.querySelector(".tab-panel.active input");
        if (firstInput) {
            setTimeout(function () { firstInput.focus(); }, 300);
        }
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
        signInBtn.focus();
    }

    signInBtn.addEventListener("click", openModal);
    modalClose.addEventListener("click", closeModal);

    // Клік по затемненню поза вікном
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закриття клавішею Esc
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });

    // Вкладки «Вхід» / «Реєстрація»
    const tabs = modal.querySelectorAll(".tab");
    const panels = modal.querySelectorAll(".tab-panel");

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) { t.classList.remove("active"); });
            panels.forEach(function (p) { p.classList.remove("active"); });
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    // Перевірка співпадіння паролів при реєстрації
    const registerForm = document.getElementById("registerTab");
    const regPassword = document.getElementById("reg-password");
    const repeatPassword = document.getElementById("repeat-password");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (regPassword.value !== repeatPassword.value) {
            repeatPassword.setCustomValidity("Паролі не співпадають");
            repeatPassword.reportValidity();
            return;
        }
        alert("Акаунт створено!");
        registerForm.reset();
        closeModal();
    });

    repeatPassword.addEventListener("input", function () {
        repeatPassword.setCustomValidity("");
    });

    document.getElementById("loginTab").addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Вхід виконано!");
        e.target.reset();
        closeModal();
    });

    /* ---------- Кнопка «вгору»: плавна поява та прокрутка ---------- */
    const backToTop = document.getElementById("backToTop");

    function toggleBackToTop() {
        backToTop.classList.toggle("show", window.scrollY > 300);
    }

    window.addEventListener("scroll", toggleBackToTop);
    toggleBackToTop();

    backToTop.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- Анімація появи елементів при прокрутці ---------- */
    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // невелика затримка для послідовної появи карток
                    const index = Array.from(entry.target.parentElement.children)
                        .indexOf(entry.target);
                    entry.target.style.transitionDelay = index * 0.12 + "s";
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealItems.forEach(function (item) { observer.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add("visible"); });
    }

    /* ---------- Анімація лічильників у статистиці ---------- */
    const counters = document.querySelectorAll("[data-count]");

    function animateCounter(el) {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1500;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.round(target * progress);
            el.textContent = value.toLocaleString("uk-UA") + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(function (c) { counterObserver.observe(c); });
    }
});
