document.addEventListener('DOMContentLoaded', () => {
    const initFeedbacksSlider = () => {
        const slider = document.querySelector('.feedbacks__slider');
        if (!slider) return;

        const track = slider.querySelector('.feedbacks__track');
        const slides = slider.querySelectorAll('.feedbacks__slide');
        const prevBtn = slider.querySelector('.feedbacks__btn--prev');
        const nextBtn = slider.querySelector('.feedbacks__btn--next');
        const dotsContainer = slider.querySelector('.feedbacks__dots');

        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoplayInterval = null;
        let isAutoplayPaused = false;

        if (totalSlides === 0) return;

        const createDots = () => {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('feedbacks__dot');
                dot.setAttribute('data-slide', i);
                dot.setAttribute('type', 'button');
                if (i === 0) dot.classList.add('feedbacks__dot--active');
                dotsContainer.appendChild(dot);
            }
        };

        const updateSlider = () => {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;

            const dots = dotsContainer.querySelectorAll('.feedbacks__dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('feedbacks__dot--active', index === currentSlide);
            });

            prevBtn.style.opacity = totalSlides <= 1 ? '0.3' : '1';
            nextBtn.style.opacity = totalSlides <= 1 ? '0.3' : '1';
            prevBtn.style.pointerEvents = totalSlides <= 1 ? 'none' : 'auto';
            nextBtn.style.pointerEvents = totalSlides <= 1 ? 'none' : 'auto';
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        };

        const prevSlide = () => {
            currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
            updateSlider();
        };

        const goToSlide = (slideIndex) => {
            if (slideIndex >= 0 && slideIndex < totalSlides) {
                currentSlide = slideIndex;
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
            if (totalSlides <= 1 || isAutoplayPaused) return;

            stopAutoplay(); // Убеждаемся, что нет дублирования
            autoplayInterval = setInterval(() => {
                if (!isAutoplayPaused) {
                    nextSlide();
                }
            }, 4000);
        };

        const pauseAutoplay = (duration = 8000) => {
            stopAutoplay();
            setTimeout(() => {
                if (!isAutoplayPaused) {
                    startAutoplay();
                }
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
            if (e.target.classList.contains('feedbacks__dot')) {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                goToSlide(slideIndex);
                pauseAutoplay();
            }
        });

        let isSliderFocused = false;

        slider.addEventListener('mouseenter', () => {
            isSliderFocused = true;
        });

        slider.addEventListener('mouseleave', () => {
            isSliderFocused = false;
        });

        document.addEventListener('keydown', (e) => {
            if (!isSliderFocused) return;

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

        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;

        const handleSwipe = () => {
            if (!isSwiping) return;

            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                pauseAutoplay();
            }

            isSwiping = false;
        };

        track?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
        }, { passive: true });

        track?.addEventListener('touchmove', (e) => {
            if (isSwiping) {
                e.preventDefault();
            }
        }, { passive: false });

        track?.addEventListener('touchend', (e) => {
            if (isSwiping) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }
        }, { passive: true });

        slider.addEventListener('mouseenter', () => {
            isAutoplayPaused = true;
            stopAutoplay();
        });

        slider.addEventListener('mouseleave', () => {
            isAutoplayPaused = false;
            startAutoplay();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else if (!isAutoplayPaused) {
                startAutoplay();
            }
        });

        window.addEventListener('resize', () => {
            updateSlider();
        });

        createDots();
        updateSlider();

        setTimeout(() => {
            startAutoplay();
        }, 100);
    };

    initFeedbacksSlider();
});
