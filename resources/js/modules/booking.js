document.addEventListener('DOMContentLoaded', () => {
    const roomInputs = document.querySelectorAll('input[name="room_id"]');
    const dateSelect = document.querySelector('select[name="date"]');
    const timeSelect = document.querySelector('select[name="time_slot_id"]');
    const bookingForm = document.querySelector('.booking__form');

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

        fetch('/booking/available-slots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || ''
            },
            body: JSON.stringify({
                room_id: selectedRoom.value,
                date: selectedDate
            })
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
                        option.value = slot.value;
                        option.textContent = slot.label;
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

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
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

            const submitButton = bookingForm.querySelector('.booking__submit');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            const formData = new FormData(bookingForm);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                || document.querySelector('input[name="_token"]')?.value;

            try {
                const response = await fetch('/api/booking', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers.get('content-type'));

                const responseText = await response.text();
                console.log('Raw response:', responseText);

                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    console.error('Response was:', responseText.substring(0, 500));
                    throw new Error('Server returned invalid response');
                }

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
});
