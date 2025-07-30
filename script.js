document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const hoverableElements = document.querySelectorAll('a, .project-item, .skill-item');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    hoverableElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- Staggered Animations ---
    const staggerGroups = document.querySelectorAll('[data-stagger-children]');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    child.style.setProperty('--stagger-index', index);
                    child.classList.add('visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    staggerGroups.forEach(group => {
        observer.observe(group);
    });

    // --- Hero Animation ---
    const heroElements = document.querySelectorAll('.reveal-hero');
    heroElements.forEach(el => el.classList.add('visible'));

    // --- General Reveal Animation ---
    const generalRevealElements = document.querySelectorAll('.section-title, .section-subtitle, .contact-links');
    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    generalRevealElements.forEach(el => {
        if (!el.closest('[data-stagger-children]')) {
            generalObserver.observe(el);
        }
    });

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item a');
    const changeLinkState = () => {
        let index = sections.length;
        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        navLinks.forEach((link) => link.classList.remove('active'));
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    };
    window.addEventListener('scroll', changeLinkState);
    changeLinkState();

    // --- Interactive Blobs & Parallax ---
    const blobContainer = document.body;
    const blobs = [];

    const blobConfigurations = [
        { size: 500, color: 'rgba(0, 122, 255, 0.15)', position: { top: '10%', left: '10%' }, speed: { x: 1.5, y: 1.2 } },
        { size: 400, color: 'rgba(88, 86, 214, 0.15)', position: { top: '60%', left: '70%' }, speed: { x: -1.2, y: -0.8 } },
        { size: 300, color: 'rgba(255, 45, 85, 0.1)', position: { top: '40%', left: '45%' }, speed: { x: 0.8, y: -1.5 } }
    ];

    blobConfigurations.forEach(config => {
        const blob = document.createElement('div');
        blob.classList.add('blob');
        blob.style.width = `${config.size}px`;
        blob.style.height = `${config.size}px`;
        blob.style.backgroundColor = config.color;
        blob.style.left = config.position.left;
        blob.style.top = config.position.top;
        blob.dataset.speedX = config.speed.x;
        blob.dataset.speedY = config.speed.y;
        blob.dataset.initialTop = parseFloat(config.position.top);
        blobContainer.appendChild(blob);
        blobs.push(blob);
    });

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        blobs.forEach(blob => {
            const { speedX, speedY, initialTop } = blob.dataset;
            
            // Mouse follow effect
            const mouseFollowX = (window.innerWidth / 2 - mouseX) * speedX / 100;
            const mouseFollowY = (window.innerHeight / 2 - mouseY) * speedY / 100;

            // Parallax scroll effect
            const scrollY = window.scrollY;
            const parallaxY = initialTop + (scrollY * speedY * 0.1);

            blob.style.transform = `translate(${mouseFollowX}px, ${mouseFollowY + (parallaxY - initialTop)}px)`;
        });
        requestAnimationFrame(animate);
    }
    animate();
});