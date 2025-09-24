document.addEventListener('DOMContentLoaded', function() {

    // === MENU HAMBURGUER RESPONSIVO ===
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);

            const icon = menuToggle.querySelector('i');
            if (isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });


        // Fecha o menu ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // === EFEITO DE SCROLL NO HEADER ===
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // === ATUALIZAR ANO NO RODAPÉ ===
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // === DESTAQUE DO LINK ATIVO NO MENU DE NAVEGAÇÃO AO ROLAR ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function updateActiveLink() {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 70; // Altura do header para offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - headerHeight - 20) { // -20 para um pequeno buffer
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); 

// === CURSOR LÍQUIDO (GOOEY) ===
    const gooeyContainer = document.createElement('div');
    gooeyContainer.className = 'cursor-container';
    document.body.appendChild(gooeyContainer);

    const gooeyCursor = document.querySelector('.cursor-gooey');
    gooeyContainer.appendChild(gooeyCursor);

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        if (gooeyCursor) {
            gooeyCursor.style.left = `${posX}px`;
            gooeyCursor.style.top = `${posY}px`;
        }
    });

    document.querySelectorAll('a, button, .projeto-card').forEach(el => {
        el.addEventListener('mouseover', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseout', () => document.body.classList.remove('cursor-hover'));
    });

    // === ANIMAÇÕES DE ENTRADA DOS PROJETOS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona um pequeno delay baseado no índice para animação escalonada
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa todos os cards de projeto para animação
    document.querySelectorAll('.projeto-card').forEach(card => {
        fadeInObserver.observe(card);
    });
});

// === LÓGICA DO EFEITO DECODIFICADOR DE TEXTO ===
    class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scrambleElements = document.querySelectorAll('.section-title, .logo');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scrambler = new TextScramble(entry.target);
                const originalText = entry.target.textContent;
                scrambler.setText(originalText);
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, { threshold: 0.5 });

    scrambleElements.forEach(el => observer.observe(el));
});