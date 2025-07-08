document.addEventListener('DOMContentLoaded', () => {
    const modalTriggers = document.querySelectorAll('[data-modal-open]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('.modal');
    const callbackForm = document.querySelector('.modal__form');

    const openModal = (modalName) => {
        const modal = document.querySelector(`[data-modal="${modalName}"]`);
        if (modal) {
            modal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modal) => {
        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    };

    const closeAllModals = () => {
        modals.forEach(modal => {
            closeModal(modal);
        });
    };

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalName = trigger.getAttribute('data-modal-open');
            openModal(modalName);
        });
    });

    modalCloseButtons.forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const modal = closeButton.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.hasAttribute('data-modal-close')) {
                closeModal(modal);
            }
        });
    });

    if (callbackForm) {
        callbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = callbackForm.querySelector('.modal__submit');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            const formData = new FormData(callbackForm);

            try {
                const response = await fetch('/callback', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });

                const result = await response.json();

                if (result.success) {
                    showNotification('Request sent successfully!', 'success');
                    callbackForm.reset();
                    closeAllModals();
                } else {
                    showNotification(result.message || 'Sending error', 'error');
                }
            } catch (error) {
                showNotification('Request submission error', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});
