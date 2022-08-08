const popWindow = (url, w, h, scroll, x, y) => {
    const X = x + 50;
    const Y = y + 0;

    const newUrl = decodeURIComponent(url.replace(/\+/g, ' '));

    window.open(newUrl, 'win', `toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=${scroll},resizable=0,width=${w},height=${h},top=${Y},left=${X}`);
};

export default popWindow;
