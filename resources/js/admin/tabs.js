document.addEventListener('DOMContentLoaded', () => {
    const tabContainers = document.querySelectorAll('[data-tabs]');

    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('[data-tab]');
        const panels = container.querySelectorAll('[data-tab-panel]');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                buttons.forEach(btn => {
                    btn.classList.remove('admin-tabs__button--active');
                });

                panels.forEach(panel => {
                    panel.classList.remove('admin-tabs__panel--active');
                });

                button.classList.add('admin-tabs__button--active');

                const targetPanel = container.querySelector(`[data-tab-panel="${targetTab}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('admin-tabs__panel--active');
                }
            });
        });
    });
});
