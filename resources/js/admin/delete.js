const confirmDelete = (message = 'Are you sure you want to delete?') => {
    return confirm(message);
};

document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!confirmDelete(form.dataset.confirm)) {
            e.preventDefault();
        }
    });
});
