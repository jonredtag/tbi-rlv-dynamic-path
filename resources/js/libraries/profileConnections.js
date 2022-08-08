export const logout = () => (
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const query = `data=${encodeURIComponent(JSON.stringify())}`;
        xhr.open('POST', '/api/profile/logout', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                resolve(data);
            } else {
                console.log('error');
            }
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send(query);
    })
);

export const forgetPassword = (params) => (
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const query = `data=${encodeURIComponent(params)}`;
        xhr.open('POST', '/api/profile/forgotPassword', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                resolve(data);
            } else {
                // this.setState({ForgotErrorStatus:true,ForgotErrorMessage:"Oops! Something went wrong, Please try again", LoadingMain: false});
                console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send(query);
    })
);

export const login = (params) => (
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const query = `data=${encodeURIComponent(params)}`;
        xhr.open('POST', '/api/profile/login', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                resolve(data);
            } else {
                reject();
            }
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send(query);
    })
);

export const register = (params) => (
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const query = `data=${encodeURIComponent(params)}`;
        xhr.open('POST', '/api/profile/register', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                resolve(data);
            } else {
                // this.setState({RegisterErrorStatus:true,RegisterErrorMessage:"Oops! Something went wrong, Please try again", LoadingMain: false});
                console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send(query);
    })
);

export const loginGoogleFacebook = (params, socialSite = 'Google') => (
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const query = `data=${encodeURIComponent(params)}`;
        const apiPath = (socialSite === 'Facebook') ? '/api/profile/loginFacebook' : '/api/profile/loginGoogle';

        xhr.open('POST', apiPath, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                resolve(data);
            } else {
                // this.setState({RegisterErrorStatus:true,RegisterErrorMessage:"Oops! Something went wrong, Please try again", LoadingMain: false});
                console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send(query);
    })
);

export const getUser = () => (
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/profile/user');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                resolve(data);
            } else {
                console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send();
    })
);
