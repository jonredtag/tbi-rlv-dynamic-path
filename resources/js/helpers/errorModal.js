import customModal from 'helpers/customModal';

const errorModal = (error) => {
    if (error.code === 's-01') {
        customModal({
            title: 'Your booking session has expired.',
            message: 'Good news, we saved your information. Please reselect your products.',
            buttons: [
                {
                    text: 'Submit',
                    type: 'secondary',
                    onClick: () => {
                        const form = document.getElementById('ses_exiredForm');
                        form.submit();
                    },
                },
            ],
        });
    } else {
        customModal({ message: error.message });
    }
};

export default errorModal;
