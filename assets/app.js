console.log("%c STOP!", "color: red; font-size: 30px; font-weight: bold;");
        console.log("If you are looking for errors, they are features. - Alok");

        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize Smooth Scroll (Lenis)
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // ------------------------------------------------
        // 2. CURSOR LOGIC
        // ------------------------------------------------
        const cursorDot = document.getElementById('cursor-dot');
        const cursorCircle = document.getElementById('cursor-circle');
        const previewImg = document.getElementById('preview-img');
        
        let mouseX = 0, mouseY = 0;
        let circleX = 0, circleY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0 });
            
            // Move project preview image
            gsap.to(previewImg, { x: mouseX, y: mouseY, duration: 0.6, ease: "power2.out" });
        });

        // Circle follows with lag
        gsap.ticker.add(() => {
            circleX += (mouseX - circleX) * 0.1;
            circleY += (mouseY - circleY) * 0.1;
            gsap.set(cursorCircle, { x: circleX - 20, y: circleY - 20 });
        });

        // Hover States
        // Added .social-card to hover targets
        const hoverEls = document.querySelectorAll('a, .magnetic-area, .project-item, .social-card');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
        });

        // ------------------------------------------------
        // 3. LOADER & INIT
        // ------------------------------------------------
        const countObj = { val: 0 };
        const loadTimeline = gsap.timeline({
            onComplete: () => {
                document.getElementById('main-content').style.opacity = 1;
                initAnimations();
            }
        });

        loadTimeline.to(countObj, {
            val: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => document.getElementById('loader-count').innerText = Math.floor(countObj.val).toString().padStart(3, '0')
        })
        .to('#loader-bar', { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0)
        .to('#loader', { yPercent: -100, duration: 1, ease: "power4.inOut" });


        // ------------------------------------------------
        // 4. ANIMATIONS
        // ------------------------------------------------
        function initAnimations() {
            
            // HERO REVEAL
            const splitName = new SplitType('.reveal-char', { types: 'chars' });
            
            splitName.chars.forEach(char => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('char-wrap');
                char.parentNode.insertBefore(wrapper, char);
                wrapper.appendChild(char);
            });

            const heroTl = gsap.timeline();
            heroTl.to('.char-wrap', { y: '0%', duration: 1, stagger: 0.05, ease: "power4.out" })
                  .to('.fade-in', { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, "-=0.5");

            // STATS COUNTERS
            gsap.utils.toArray('.counter').forEach(el => {
                const target = el.getAttribute('data-target');
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 90%",
                    onEnter: () => {
                        gsap.to(el, {
                            innerText: target,
                            duration: 2,
                            snap: { innerText: 1 },
                            ease: "power2.out"
                        });
                    }
                });
            });

            // TIMELINE ITEMS
            gsap.utils.toArray('.timeline-item').forEach(item => {
                gsap.to(item, {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: true
                    }
                });
            });

            // HORIZONTAL SKILLS SCROLL
            let mm = gsap.matchMedia();
            mm.add("(min-width: 768px)", () => {
                const skillsTrack = document.getElementById('skills-track');
                const getScrollAmount = () => -(skillsTrack.scrollWidth - window.innerWidth);
                
                gsap.to(skillsTrack, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#skills-wrapper",
                        start: "top top",
                        end: () => `+=${skillsTrack.scrollWidth - window.innerWidth}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                });
            });

            // PROJECT HOVER IMAGES
            const projects = document.querySelectorAll('.project-item');
            projects.forEach(project => {
                project.addEventListener('mouseenter', () => {
                    const src = project.getAttribute('data-img');
                    previewImg.src = src;
                    gsap.to(previewImg, { scale: 1, opacity: 1, duration: 0.3 });
                });
                project.addEventListener('mouseleave', () => {
                    gsap.to(previewImg, { scale: 0, opacity: 0, duration: 0.3 });
                });
            });

            // MARQUEE
            gsap.to('.marquee-text', {
                xPercent: -50,
                repeat: -1,
                duration: 20,
                ease: "linear"
            });

            // ------------------------------------
            // FIXED ANIMATIONS: SOCIALS & FORM
            // ------------------------------------
            
            // Social Cards: Elastic Pop effect
            gsap.fromTo(".social-card", 
                { y: 50, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.2)", // Subtle bounce
                    scrollTrigger: {
                        trigger: "#social-grid",
                        start: "top 85%"
                    }
                }
            );

            // Form Inputs: Sequential Slide-in
            gsap.fromTo(".form-group", 
                { x: -30, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: "#chaos-form",
                        start: "top 80%"
                    }
                }
            );
        }