document.addEventListener('DOMContentLoaded', () => {
    const initUniversalSlider = (sliderSelector, options = {}) => {
        const slider = document.querySelector(sliderSelector);
        if (!slider) return;

        const track = slider.querySelector('.slider__track');
        const slides = slider.querySelectorAll('.slider__slide');
        const prevBtn = slider.querySelector('.slider__btn--prev');
        const nextBtn = slider.querySelector('.slider__btn--next');
        const dotsContainer = slider.querySelector('.slider__dots');
        const totalSlides = slides.length;

        if (!track || totalSlides === 0) return;

        const config = {
            autoplay: true,
            autoplayDelay: 4000,
            pauseOnHover: true,
            pauseOnInteraction: 8000,
            swipeThreshold: 50,
            enableKeyboard: true,
            enableTouch: true,
        };

        let currentSlide = 0;
        let autoplayInterval = null;
        let isAutoplayPaused = false;

        const componentPrefix = sliderSelector.match(/feedbacks|room/)?.[0] || 'slider';

        const createDots = () => {
            if (!dotsContainer) return;

            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = `slider__dot ${componentPrefix}__dot`;
                dot.type = 'button';
                dot.setAttribute('data-slide', i);
                dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
                if (i === 0) dot.classList.add('slider__dot--active', `${componentPrefix}__dot--active`);
                dotsContainer.appendChild(dot);
            }
        };

        const updateSlider = () => {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;

            if (dotsContainer) {
                dotsContainer.querySelectorAll('.slider__dot').forEach((dot, index) => {
                    const isActive = index === currentSlide;
                    dot.classList.toggle('slider__dot--active', isActive);
                    dot.classList.toggle(`${componentPrefix}__dot--active`, isActive);
                    dot.setAttribute('aria-pressed', isActive);
                });
            }

            if (prevBtn && nextBtn) {
                const disabled = totalSlides <= 1;
                [prevBtn, nextBtn].forEach(btn => {
                    btn.style.opacity = disabled ? '0.3' : '1';
                    btn.style.pointerEvents = disabled ? 'none' : 'auto';
                    btn.disabled = disabled;
                });
            }

            slider.dispatchEvent(new CustomEvent('sliderChange', {
                detail: { currentSlide, totalSlides }
            }));
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        };

        const goToSlide = (index) => {
            if (index >= 0 && index < totalSlides && index !== currentSlide) {
                currentSlide = index;
                updateSlider();
            }
        };

        const stopAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        };

        const startAutoplay = () => {
            if (!config.autoplay || totalSlides <= 1 || isAutoplayPaused) return;
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                if (!isAutoplayPaused) nextSlide();
            }, config.autoplayDelay);
        };

        const pauseAutoplay = (duration = config.pauseOnInteraction) => {
            if (!config.autoplay) return;
            stopAutoplay();
            setTimeout(() => {
                if (!isAutoplayPaused) startAutoplay();
            }, duration);
        };

        nextBtn?.addEventListener('click', () => {
            nextSlide();
            pauseAutoplay();
        });

        prevBtn?.addEventListener('click', () => {
            prevSlide();
            pauseAutoplay();
        });

        dotsContainer?.addEventListener('click', (e) => {
            const target = e.target.closest('.slider__dot');
            if (!target) return;
            const index = parseInt(target.getAttribute('data-slide'));
            goToSlide(index);
            pauseAutoplay();
        });

        if (config.enableKeyboard) {
            let isFocused = false;
            slider.addEventListener('mouseenter', () => isFocused = true);
            slider.addEventListener('mouseleave', () => isFocused = false);

            document.addEventListener('keydown', (e) => {
                if (!isFocused) return;
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSlide();
                    pauseAutoplay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                    pauseAutoplay();
                }
            });
        }

        if (config.enableTouch) {
            let touchStartX = 0;
            let touchEndX = 0;
            let isSwiping = false;

            track.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                isSwiping = true;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                if (!isSwiping) return;
                touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > config.swipeThreshold) {
                    if (diff > 0) nextSlide();
                    else prevSlide();
                    pauseAutoplay();
                }
                isSwiping = false;
            }, { passive: true });
        }

        if (config.pauseOnHover) {
            slider.addEventListener('mouseenter', () => {
                isAutoplayPaused = true;
                stopAutoplay();
            });

            slider.addEventListener('mouseleave', () => {
                isAutoplayPaused = false;
                startAutoplay();
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAutoplay();
            else if (!isAutoplayPaused && config.autoplay) startAutoplay();
        });

        window.addEventListener('resize', updateSlider);

        const sliderAPI = {
            next: nextSlide,
            prev: prevSlide,
            goTo: goToSlide,
            start: startAutoplay,
            stop: stopAutoplay,
            pause: pauseAutoplay,
            getCurrentSlide: () => currentSlide,
            getTotalSlides: () => totalSlides,
            destroy: stopAutoplay
        };

        slider.sliderAPI = sliderAPI;

        createDots();
        updateSlider();
        if (config.autoplay) startAutoplay();

        return sliderAPI;
    };

    initUniversalSlider('.feedbacks__slider', {
        autoplay: true,
        autoplayDelay: 5000
    });

    initUniversalSlider('.room__slider', {
        autoplay: true,
        autoplayDelay: 4000
    });

    window.initUniversalSlider = initUniversalSlider;
});
