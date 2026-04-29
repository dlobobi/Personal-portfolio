// 0. Global Interactive Elements
function initGlobalInteractions() {
    // 1. Custom Cursor (Desktop Only)
    if (window.innerWidth >= 1024) {
        let cursor = document.getElementById('cursor');
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.id = 'cursor';
            document.body.appendChild(cursor);
        }

        // Hide real cursor and show custom one
        document.documentElement.classList.add('has-custom-cursor');

        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        });

        // Add hover effects for interactive elements
        const interactives = document.querySelectorAll('a, button, .cursor-pointer, .glass, .tilt-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.5, duration: 0.3 }));
            el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.3 }));
        });
    }

    // 2. Magnetic Buttons
    const magneticWraps = document.querySelectorAll('.magnetic-wrap');
    magneticWraps.forEach(wrap => {
        const btn = wrap.children[0];
        if (btn) {
            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3 });
            });
            wrap.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
        }
    });

    // 3. 3D Tilt Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.style.willChange = "transform";
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 20;
            const rotateX = ((y / rect.height) - 0.5) * -20;
            gsap.to(card, { 
                rotateY: rotateY, 
                rotateX: rotateX, 
                scale: 1.05,
                duration: 0.5, 
                ease: "power2.out",
                transformPerspective: 1000 
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "power2.out" });
        });
    });

    // 4. Progressive Reveal Text
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(revealText => {
        if (!revealText.querySelector('span')) {
            const content = revealText.innerText;
            revealText.innerHTML = content.split('').map(char => `<span>${char}</span>`).join('');
        }
        
        gsap.to(revealText.querySelectorAll('span'), {
            opacity: 1,
            stagger: 0.02,
            scrollTrigger: {
                trigger: revealText,
                start: "top 85%",
                end: "bottom 60%",
                scrub: true
            }
        });
    });
}

// 0. Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Function to apply the theme
function applyTheme(theme) {
    if (theme === 'light') {
        htmlElement.classList.add('light');
    } else {
        htmlElement.classList.remove('light');
    }
}

// Check for saved theme or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
}

// Handle theme toggle click
document.addEventListener('click', (e) => {
    const target = e.target.closest('#theme-toggle');
    if (target) {
        const isLight = htmlElement.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }
});

// 1. Loading Screen & Initial Animations
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const body = document.getElementById('body');

    // Check if the user has already visited the site in this session
    const hasLoadedBefore = sessionStorage.getItem('siteLoaded');

    if (!hasLoadedBefore) {
        // First visit: Show the mail loader, then reveal the site
        setTimeout(() => {
            if(loader) loader.classList.add('hide-loader');
            if(body) body.classList.remove('overflow-y-hidden');
            if(mainContent) mainContent.classList.remove('opacity-0');

            triggerGSAPAnimations();

            // Set the flag so it doesn't load again
            sessionStorage.setItem('siteLoaded', 'true');
        }, 1200);
    } else {
        // Already visited: Hide the loader instantly, no waiting
        if(loader) loader.style.display = 'none';
        if(body) body.classList.remove('overflow-y-hidden');
        if(mainContent) mainContent.classList.remove('opacity-0');

        triggerGSAPAnimations();
    }
});

// Function to handle the GSAP fade-ins
function triggerGSAPAnimations() {
    initGlobalInteractions();
    
    if(document.querySelector('.gsap-hero')) {
        gsap.from(".gsap-hero", { y: 30, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1 });
    }
    if(document.querySelector('.gsap-stagger')) {
        gsap.from(".gsap-stagger", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.15 });
    }
}

// 2. Initialize Lenis (Smooth Scrolling)
const lenis = new Lenis({ duration: 1.2 });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 3. Initialize GSAP Scroll Animations (Fade elements up as you scroll)
gsap.registerPlugin(ScrollTrigger);

//FIX - MOBILE JUMP
ScrollTrigger.config({ ignoreMobileResize: true });

gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: { trigger: element, start: "top 85%" },
        y: 30, opacity: 0, duration: 1, ease: "power2.out"
    });
});