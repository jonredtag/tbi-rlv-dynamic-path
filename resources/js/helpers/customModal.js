import Modal from 'modules/modal';

const customModal = ({ message = '', title = '', buttons = [{ text: 'OK', onClick: () => {}, type: 'secondary' }] }) => {
    const messageElement = document.getElementById('mdl_message');
    const messageTitle = document.getElementById('mdl_title');

    if (title !== '') {
        messageTitle.innerHTML = title;
    }
    messageElement.innerHTML = message;

    const buttonsElement = document.getElementById('mdl_buttons');
    buttonsElement.innerHTML = '';
    buttons.forEach((button) => {
        const buttonElement = document.createElement('button');
        buttonElement.classList.add('btn');
        buttonElement.setAttribute('data-dismiss', 'modal');
        if (button.type === 'primary') {
            buttonElement.classList.add('btn-focus', 'col-3');
        } else if (button.type === 'secondary') {
            buttonElement.classList.add('btn-secondary');
        } else {
            // buttonElement.classList.add('');
        }
        buttonElement.innerHTML = button.text;
        buttonElement.addEventListener('click', button.onClick);

        buttonsElement.appendChild(buttonElement);
    });
    Modal.show('#mdl_custom');
};

export default customModal;
