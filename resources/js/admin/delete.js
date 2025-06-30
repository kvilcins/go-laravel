const confirmDelete = (message = 'Вы уверены, что хотите удалить?') => {
    return confirm(message);
};

document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!confirmDelete(form.dataset.confirm)) {
            e.preventDefault();
        }
    });
});
