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
            if(body) body.classList.remove('overflow-hidden');
            if(mainContent) mainContent.classList.remove('opacity-0');

            triggerGSAPAnimations();

            // Set the flag so it doesn't load again
            sessionStorage.setItem('siteLoaded', 'true');
        }, 1200);
    } else {
        // Already visited: Hide the loader instantly, no waiting
        if(loader) loader.style.display = 'none';
        if(body) body.classList.remove('overflow-hidden');
        if(mainContent) mainContent.classList.remove('opacity-0');

        triggerGSAPAnimations();
    }
});

// Function to handle the GSAP fade-ins
function triggerGSAPAnimations() {
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
gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: { trigger: element, start: "top 85%" },
        y: 30, opacity: 0, duration: 1, ease: "power2.out"
    });
});