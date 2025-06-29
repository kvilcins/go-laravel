document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking__form');
    const roomInputs = document.querySelectorAll('input[name="room_id"]');
    const dateSelect = document.querySelector('select[name="date"]');
    const timeSelect = document.querySelector('select[name="time_slot_id"]');
    const availabilityInfo = document.querySelector('.booking__availability-info');
    const availabilityText = document.querySelector('.booking__availability-text');

    const generateDateOptions = () => {
        const today = new Date();
        const dateOptions = [];

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });

            const value = date.toISOString().split('T')[0];
            const label = `${day}.${month} (${dayName})`;

            dateOptions.push({ value, label });
        }

        console.log('Generated date options:', dateOptions);
        return dateOptions;
    };

    const populateDateSelect = () => {
        if (dateSelect) {
            const dates = generateDateOptions();
            dateSelect.innerHTML = '<option value="">Дата</option>';

            dates.forEach(date => {
                const option = document.createElement('option');
                option.value = date.value;
                option.textContent = date.label;
                dateSelect.appendChild(option);
            });

            console.log('Date select populated');
        }
    };

    populateDateSelect();

    const showNotification = (message, type = 'success') => {
        console.log(`Show notification [${type}]: ${message}`);

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
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                console.log('Notification removed');
            }
        }, 7000);
    };

    const updateAvailableTimes = async () => {
        console.log('updateAvailableTimes called');

        const selectedRoom = document.querySelector('input[name="room_id"]:checked');
        const selectedDate = dateSelect.value;

        console.log('Selected room:', selectedRoom ? selectedRoom.value : null);
        console.log('Selected date:', selectedDate);

        if (!selectedRoom || !selectedDate) {
            timeSelect.disabled = true;
            timeSelect.innerHTML = '<option value="">Сначала выберите дату и зал</option>';
            if (availabilityInfo) {
                availabilityInfo.style.display = 'none';
            }
            console.log('updateAvailableTimes exited early: no room or date selected');
            return;
        }

        try {
            timeSelect.disabled = true;
            timeSelect.innerHTML = '<option value="">Загрузка...</option>';

            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch('/booking/available-slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken.getAttribute('content')
                },
                body: JSON.stringify({
                    room_id: selectedRoom.value,
                    date: selectedDate
                })
            });

            console.log('Fetch response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('Available slots response:', result);

            timeSelect.innerHTML = '<option value="">Выберите время</option>';

            if (result.available_times && result.available_times.length === 0) {
                timeSelect.innerHTML = '<option value="">Все слоты заняты</option>';
                if (availabilityText) {
                    availabilityText.textContent = 'К сожалению, на выбранную дату все слоты заняты. Выберите другую дату.';
                }
                if (availabilityInfo) {
                    availabilityInfo.style.display = 'block';
                }
                timeSelect.disabled = true;
            } else if (result.available_times) {
                result.available_times.forEach(time => {
                    const option = document.createElement('option');
                    option.value = time.value;
                    option.textContent = time.label;
                    timeSelect.appendChild(option);
                });

                timeSelect.disabled = false;

                if (result.booked_times && result.booked_times.length > 0) {
                    if (availabilityText) {
                        availabilityText.textContent = `Занятые слоты: ${result.booked_times.join(', ')}`;
                    }
                    if (availabilityInfo) {
                        availabilityInfo.style.display = 'block';
                    }
                } else {
                    if (availabilityInfo) {
                        availabilityInfo.style.display = 'none';
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка получения доступных слотов:', error);
            timeSelect.innerHTML = '<option value="">Ошибка загрузки</option>';
            timeSelect.disabled = true;
            showNotification('Ошибка при загрузке доступного времени', 'error');
        }
    };

    const checkSlotAvailability = async () => {
        console.log('checkSlotAvailability called');

        const selectedRoom = document.querySelector('input[name="room_id"]:checked');
        const selectedDate = dateSelect.value;
        const selectedTime = timeSelect.value;

        console.log('Selected for availability check:', {
            room: selectedRoom ? selectedRoom.value : null,
            date: selectedDate,
            time: selectedTime
        });

        if (!selectedRoom || !selectedDate || !selectedTime) {
            console.log('checkSlotAvailability exited early: missing selection');
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch('/booking/check-availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken.getAttribute('content')
                },
                body: JSON.stringify({
                    room_id: selectedRoom.value,
                    date: selectedDate,
                    time: selectedTime
                })
            });

            console.log('Check availability response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('Check availability result:', result);

            if (!result.available) {
                showNotification('Выбранное время уже забронировано. Пожалуйста, обновите страницу и выберите другое время.', 'error');
                timeSelect.style.borderColor = '#f44336';
                updateAvailableTimes();
            } else {
                timeSelect.style.borderColor = '';
            }
        } catch (error) {
            console.error('Ошибка проверки доступности:', error);
        }
    };

    if (roomInputs.length > 0) {
        roomInputs.forEach(input => {
            input.addEventListener('change', () => {
                console.log('Room changed to:', input.value);
                updateAvailableTimes();
            });
        });
    }

    if (dateSelect) {
        dateSelect.addEventListener('change', () => {
            console.log('Date changed to:', dateSelect.value);
            updateAvailableTimes();
        });
    }

    if (timeSelect) {
        timeSelect.addEventListener('change', () => {
            console.log('Time slot changed to:', timeSelect.value);
            checkSlotAvailability();
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            console.log('Booking form submit triggered');

            const submitButton = bookingForm.querySelector('.booking__submit');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Отправка...';
            submitButton.disabled = true;

            const formData = new FormData(bookingForm);

            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]');
                if (!csrfToken) {
                    throw new Error('CSRF token not found');
                }

                const response = await fetch('/booking', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': csrfToken.getAttribute('content')
                    }
                });

                console.log('Booking submit response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                console.log('Booking submit result:', result);

                if (result.success) {
                    showNotification('Бронирование успешно отправлено! Ожидайте подтверждения.', 'success');
                    bookingForm.reset();

                    if (timeSelect) {
                        timeSelect.disabled = true;
                        timeSelect.innerHTML = '<option value="">Сначала выберите дату и зал</option>';
                    }

                    if (availabilityInfo) {
                        availabilityInfo.style.display = 'none';
                    }

                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 1000);
                } else {
                    if (result.errors) {
                        Object.values(result.errors).forEach(errorMessages => {
                            errorMessages.forEach(message => {
                                showNotification(message, 'error');
                            });
                        });
                    } else {
                        showNotification(result.message || 'Ошибка при отправке бронирования', 'error');
                    }
                }
            } catch (error) {
                console.error('Booking error:', error);
                showNotification('Ошибка при отправке бронирования', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});
