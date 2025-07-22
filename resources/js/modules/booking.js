document.addEventListener('DOMContentLoaded', () => {
    const roomInputs = document.querySelectorAll('input[name="room_id"]');
    const dateSelect = document.querySelector('select[name="date"]');
    const timeSelect = document.querySelector('select[name="time_slot_id"]');
    const bookingForm = document.querySelector('.booking__form');

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    };

    const validateRequired = (value, fieldName) => {
        if (!value || !value.trim()) {
            return `${fieldName} is required`;
        }
        return null;
    };

    const validatePhone = (phone) => {
        if (!phone || !phone.trim()) {
            return 'Phone number is required';
        }

        const phoneRegex = /^\+?[7-8]-?[0-9]{3}-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/;
        if (!phoneRegex.test(phone.trim())) {
            return 'Please enter a valid phone number (format: +7-XXX-XXX-XX-XX)';
        }
        return null;
    };

    const validateEmail = (email) => {
        if (!email || !email.trim()) {
            return null;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return 'Please enter a valid email address';
        }
        return null;
    };

    const validateBookingForm = (formData) => {
        const errors = [];

        if (!formData.get('room_id')) {
            errors.push('Please select a room');
        }

        if (!formData.get('date')) {
            errors.push('Please select a date');
        }

        if (!formData.get('time_slot_id')) {
            errors.push('Please select a time slot');
        }

        if (!formData.get('amount')) {
            errors.push('Please select number of people');
        }

        const firstNameError = validateRequired(formData.get('first_name'), 'First name');
        if (firstNameError) errors.push(firstNameError);

        const lastNameError = validateRequired(formData.get('last_name'), 'Last name');
        if (lastNameError) errors.push(lastNameError);

        const phoneError = validatePhone(formData.get('phone'));
        if (phoneError) errors.push(phoneError);

        const emailError = validateEmail(formData.get('email'));
        if (emailError) errors.push(emailError);

        return errors;
    };

    const validateCallbackForm = (formData) => {
        const errors = [];

        const nameError = validateRequired(formData.get('name'), 'Name');
        if (nameError) errors.push(nameError);

        const phoneError = validatePhone(formData.get('phone'));
        if (phoneError) errors.push(phoneError);

        const emailError = validateEmail(formData.get('email'));
        if (emailError) errors.push(emailError);

        return errors;
    };

    const loadAvailableDates = () => {
        if (!dateSelect) return;

        fetch('/booking/available-dates')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    dateSelect.innerHTML = '<option value="">Error loading dates</option>';
                    return;
                }
                dateSelect.innerHTML = '<option value="">Date</option>';
                data.dates.forEach(date => {
                    const option = document.createElement('option');
                    option.value = date.value;
                    option.textContent = date.label;
                    dateSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error loading dates:', error);
                if (dateSelect) {
                    dateSelect.innerHTML = '<option value="">Error loading dates</option>';
                }
            });
    };

    const showTimeMessage = (text) => {
        if (!timeSelect) return;
        timeSelect.innerHTML = `<option value="">${text}</option>`;
        timeSelect.disabled = true;
    };

    const loadAvailableSlots = () => {
        const selectedRoom = document.querySelector('input[name="room_id"]:checked');
        const selectedDate = dateSelect ? dateSelect.value : '';

        if (!selectedRoom || !selectedDate) {
            showTimeMessage('First select room and date');
            return;
        }

        showTimeMessage('Loading...');

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || document.querySelector('input[name="_token"]')?.value;

        const formData = new FormData();
        formData.append('room_id', selectedRoom.value);
        formData.append('date', selectedDate);
        formData.append('_token', csrfToken);

        fetch('/booking/available-slots', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showTimeMessage('Loading error');
                    return;
                }

                if (!timeSelect) return;

                timeSelect.innerHTML = '<option value="">Select time</option>';

                if (Array.isArray(data.available_times) && data.available_times.length > 0) {
                    data.available_times.forEach(slot => {
                        const option = document.createElement('option');
                        option.value = slot.value || slot.label;
                        option.textContent = slot.label || slot.value;
                        timeSelect.appendChild(option);
                    });
                    timeSelect.disabled = false;
                } else {
                    showTimeMessage('No available slots');
                }
            })
            .catch(error => {
                console.error('Error loading slots:', error);
                showTimeMessage('Loading error');
            });
    };

    const setupCallbackForm = () => {
        const form = document.querySelector('.modal__form');
        if (!form) return;

        const originalSubmitHandler = form.cloneNode(true);
        form.parentNode.replaceChild(originalSubmitHandler, form);

        originalSubmitHandler.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(originalSubmitHandler);
            const errors = validateCallbackForm(formData);

            if (errors.length > 0) {
                showNotification(errors[0], 'error');
                return;
            }

            const submitButton = originalSubmitHandler.querySelector('.modal__submit');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const response = await fetch('/callback/send', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (result.success) {
                    showNotification(result.message, 'success');
                    originalSubmitHandler.reset();

                    const modal = originalSubmitHandler.closest('.modal');
                    if (modal) {
                        modal.classList.remove('modal--active');
                        document.body.style.overflow = '';
                    }
                } else {
                    showNotification(result.message || 'Sending error', 'error');
                }
            } catch (error) {
                console.error('Callback submission error:', error);
                showNotification('Request submission error', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    };

    loadAvailableDates();

    roomInputs.forEach(input => {
        input.addEventListener('change', loadAvailableSlots);
    });

    if (dateSelect) {
        dateSelect.addEventListener('change', loadAvailableSlots);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const errors = validateBookingForm(formData);

            if (errors.length > 0) {
                showNotification(errors[0], 'error');
                return;
            }

            const submitButton = bookingForm.querySelector('.booking__submit');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Booking...';
            submitButton.disabled = true;

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                || document.querySelector('input[name="_token"]')?.value;

            try {
                const response = await fetch('/api/booking/submit', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification(result.message || 'Booking successfully created!', 'success');

                    bookingForm.reset();

                    if (timeSelect) {
                        timeSelect.innerHTML = '<option value="">First select date and room</option>';
                        timeSelect.disabled = true;
                    }
                    if (dateSelect) dateSelect.selectedIndex = 0;
                    roomInputs.forEach(input => input.checked = false);
                } else {
                    showNotification(result.message || 'Booking error', 'error');
                }
            } catch (error) {
                console.error('Booking error:', error);
                showNotification('Form submission error', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    setupCallbackForm();
});
