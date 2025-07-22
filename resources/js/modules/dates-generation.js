document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-dates-btn');
    const monthsSelect = document.getElementById('months-select');
    const resultDiv = document.getElementById('generate-result');

    if (generateBtn && monthsSelect && resultDiv) {
        const buttonText = generateBtn.querySelector('.btn__text');
        const spinner = generateBtn.querySelector('.btn__spinner');

        generateBtn.addEventListener('click', async () => {
            const months = monthsSelect.value;

            generateBtn.disabled = true;
            if (buttonText) buttonText.textContent = 'Generating...';
            if (spinner) spinner.style.display = 'inline';
            resultDiv.style.display = 'none';

            try {
                const response = await fetch('/admin/generate-dates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ months: parseInt(months) })
                });

                const result = await response.json();

                resultDiv.style.display = 'block';
                resultDiv.className = 'form-result ' +
                    (result.success ? 'form-result--success' : 'form-result--error');

                if (result.success) {
                    resultDiv.innerHTML = `
                        <strong>✅ Success!</strong><br>
                        ${result.message}<br>
                        <small>Generated: ${result.generated} dates</small>
                    `;

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    resultDiv.innerHTML = `<strong>❌ Error!</strong><br>${result.message}`;
                }

            } catch (error) {
                console.error('Error:', error);
                resultDiv.style.display = 'block';
                resultDiv.className = 'form-result form-result--error';
                resultDiv.innerHTML = '<strong>❌ Error!</strong><br>Network error occurred';
            } finally {
                generateBtn.disabled = false;
                if (buttonText) buttonText.textContent = 'Generate Dates';
                if (spinner) spinner.style.display = 'none';
            }
        });
    }
});
