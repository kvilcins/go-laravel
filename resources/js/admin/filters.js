document.addEventListener('DOMContentLoaded', () => {
    const adminFiltersForm = document.querySelector('.admin-filters-form');

    if (!adminFiltersForm) {
        return;
    }

    const clearFiltersBtn = document.getElementById('clearFilters');

    if (clearFiltersBtn && adminFiltersForm) {
        clearFiltersBtn.addEventListener('click', () => {
            const selects = adminFiltersForm.querySelectorAll('select');
            selects.forEach(select => {
                select.value = '';
            });

            adminFiltersForm.submit();
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const hasFilters = Array.from(urlParams.keys()).some(key =>
        ['room_id', 'admin_date', 'admin_time_slot_id', 'availability'].includes(key) && urlParams.get(key)
    );

    if (clearFiltersBtn) {
        if (hasFilters) {
            clearFiltersBtn.style.display = 'block';
        } else {
            clearFiltersBtn.style.display = 'none';
        }
    }

    const adminTimeSelect = document.querySelector('select[name="admin_time_slot_id"]');
    if (adminTimeSelect) {
        adminTimeSelect.setAttribute('data-protected', 'true');
        adminTimeSelect.removeAttribute('disabled');

        const protectTimeSelect = () => {
            if (adminTimeSelect.hasAttribute('disabled')) {
                adminTimeSelect.removeAttribute('disabled');
            }

            const firstOption = adminTimeSelect.querySelector('option[value=""]');
            if (firstOption && (firstOption.textContent.includes('Сначала') || firstOption.textContent.includes('Загрузка'))) {
                firstOption.textContent = 'Все времена';
            }
        };

        const observer = new MutationObserver(() => {
            protectTimeSelect();
        });

        observer.observe(adminTimeSelect, {
            attributes: true,
            childList: true,
            subtree: true
        });

        protectTimeSelect();

        setInterval(protectTimeSelect, 500);
    }

    const adminDateSelect = document.querySelector('select[name="admin_date"]');
    if (adminDateSelect) {
        adminDateSelect.setAttribute('data-protected', 'true');

        const protectDateSelect = () => {
            if (adminDateSelect.hasAttribute('disabled')) {
                adminDateSelect.removeAttribute('disabled');
            }
        };

        const dateObserver = new MutationObserver(() => {
            protectDateSelect();
        });

        dateObserver.observe(adminDateSelect, {
            attributes: true
        });

        protectDateSelect();
    }

    const style = document.createElement('style');
    style.textContent = `
        select[data-protected="true"] {
            pointer-events: auto !important;
        }
        select[data-protected="true"]:disabled {
            opacity: 1 !important;
            pointer-events: auto !important;
            background-color: white !important;
            color: black !important;
        }
    `;
    document.head.appendChild(style);
});
