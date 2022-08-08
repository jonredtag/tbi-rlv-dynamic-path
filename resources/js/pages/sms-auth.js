const button = document.getElementById('sms_resend');

button.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', `/deal/resendtoken/${button.dataset.code}`);

    xhr.send();
});
