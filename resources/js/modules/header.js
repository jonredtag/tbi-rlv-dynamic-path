const hamburgerClick = () => {
    const mobileMenu = document.getElementById('navbar-mobile');

    if (mobileMenu.classList.contains('navbar-out')) {
        mobileMenu.classList.remove('navbar-out');
        mobileMenu.classList.add('navbar-in');
    } else if (mobileMenu.classList.contains('navbar-in')) {
        mobileMenu.classList.remove('navbar-in');
        mobileMenu.classList.add('navbar-out');
    } else {
        mobileMenu.classList.add('navbar-in');
    }
    const navBackDrop = document.getElementById('nav-backdrop');

    if (navBackDrop.classList.contains('not-visible')) {
        navBackDrop.classList.remove('not-visible');
        navBackDrop.classList.add('is-visible');
    } else if (navBackDrop.classList.contains('is-visible')) {
        navBackDrop.classList.remove('is-visible');
        navBackDrop.classList.add('not-visible');
    } else {
        navBackDrop.classList.add('is-visible');
    }
};

const navBackDropClick = () => {
    const navBackDrop = document.getElementById('nav-backdrop');

    navBackDrop.classList.remove('is-visible');
    navBackDrop.classList.add('not-visible');

    const mobileMenu = document.getElementById('navbar-mobile');
    mobileMenu.classList.remove('navbar-in');
    mobileMenu.classList.add('navbar-out');
};

const hamburger = document.getElementById('hamburger');
const navBackDropArea = document.getElementById('nav-backdrop');

hamburger.addEventListener('click', hamburgerClick);
navBackDropArea.addEventListener('click', navBackDropClick);
