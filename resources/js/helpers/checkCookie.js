const checkCookie = (key) => {
    const cookies = document.cookie.split('; ');

    const index = cookies.findIndex((cookie) => cookie.startsWith(key));

    if (index !== -1) {
        const cookie = cookies[index];
        const [, value] = cookie.split('=');

        return value;
    }

    return null;
};

export default checkCookie;
