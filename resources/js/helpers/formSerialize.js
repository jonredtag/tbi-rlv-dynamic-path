const formSerialize = (form) => {
    const obj = {};
    const elements = Array.from(form.querySelectorAll('input, select, textarea'));
    elements.forEach((element) => {
        const { name, value } = element;

        if (name) {
            if (
                (
                    element.tagName.toLowerCase() === 'input' && (
                        (
                            (
                                element.type === 'radio' || element.type === 'checkbox'
                            ) && element.checked
                        )
                        || element.type === 'text' || element.type === 'hidden' || element.type === 'email' || element.type === 'tel' || element.type === 'password'
                    )
                )
                || element.tagName.toLowerCase() !== 'input'
            ) {
                const levels = name.split('.');
                let pointer = obj;
                levels.forEach((level, index) => {
                    let key = level;
                    if (level.startsWith('[') || level.startsWith('{')) {
                        key = level.slice(1, -1);
                        if (level.startsWith('[') && typeof pointer[key] !== 'object') {
                            pointer[key] = [];
                        } else if (level.startsWith('{') && typeof pointer[key] !== 'object') {
                            pointer[key] = {};
                        }
                        if (level.startsWith('[') && (index + 1 === levels.length)) {
                            pointer[key].push(value);
                        } else {
                            pointer = pointer[key];
                        }
                    } else {
                        pointer[key] = value;
                    }
                });
            }
        }
    });

    return obj;
};

export default formSerialize;
