class Modal {
    constructor() {
        this.modalKeyDown = this.modalKeyDown.bind(this);
        this.openModals = [];
        this.connectOpenButtons = this.connectOpenButtons.bind(this);

        this.body = document.body;
        this.scrollbarWidth = 0;
        this.globalObject = typeof global !== 'undefined' ? global : window;
        this.doc = document.documentElement;
    }

    init() {
        const app = document.getElementById('app');

        app.addEventListener('click', this.connectOpenButtons);
    }

    connectOpenButtons(event) {
        let node = event.target;

        let within = false;

        while (node !== event.currentTarget) {
            const dataSet = JSON.parse(JSON.stringify(node.dataset));
            if (Object.prototype.hasOwnProperty.call(dataSet, 'toggle') && dataSet.toggle === 'modal') {
                within = true;
                break;
            }
            node = node.parentNode;
        }

        if (within) {
            // equip modal button - with activate data property
            // if activate is set - this is meant to set a specific tab to active
            // within a set of tabs inside of modal
            if (node.dataset.activate !== undefined) {
                const activated = document.getElementById(node.dataset.activate);
                // const masterTabLinks = activated.parentNode.parentNode.children;

                // // deactivate all master tab links
                // for (let a = 0; a < masterTabLinks.length; a++) {
                //     const masterTabLinkSibling = masterTabLinks[a].childNodes[1];
                //     masterTabLinkSibling.classList.remove('active');
                // }
                // activate specified tab
                activated.classList.add('active');
                activated.click();
            }
            this.show(node.dataset.target);
        }
    }

    getWindowWidth() {
        const htmlRect = this.doc.getBoundingClientRect();
        return this.globalObject.innerWidth || (htmlRect.right - Math.abs(htmlRect.left));
    }

    setScrollbar() {
        const bodyStyle = this.body.currentStyle || this.globalObject.getComputedStyle(this.body);
        const bodyPad = parseInt((bodyStyle.paddingRight), 10);

        if (this.bodyIsOverflowing) { this.body.style.paddingRight = `${bodyPad + this.scrollbarWidth}px`; }
    }

    resetScrollbar() {
        this.body.style.paddingRight = '';
    }

    measureScrollbar() { // thx walsh
        const scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure'; // this is here to stay
        this.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

        this.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }

    checkScrollbar() {
        this.bodyIsOverflowing = this.body.clientWidth < this.getWindowWidth();
        // modalIsOverflowing = modal['scrollHeight'] > this.doc['clientHeight'];
        this.scrollbarWidth = this.measureScrollbar();
    }

    modalKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
            event.preventDefault();
            this.close('.modal');
        }
    }

    pageRefresh(event) {
        if (event.persisted) {
            window.location.href = window.location.href;
        }
    }

    show(target) {
        // console.log('trying to show modal', target);
        const targetModals = document.querySelectorAll(target);
        targetModals.forEach((targetModal) => {
            this.checkScrollbar();
            this.setScrollbar();

            this.openModals.push(targetModal);
            targetModal.classList.add('show');
            targetModal.setAttribute('aria-hidden', false);
            targetModal.style.cssText = 'display: block;';

            // body modifications
            this.body.classList.add('modal-open');

            // create overlay
            const overlay = document.createElement('div');
            overlay.classList.add('modal-backdrop');
            overlay.classList.add('fade');
            overlay.classList.add('show');
            overlay.setAttribute('id', 'overlay');

            // append overlay to body
            this.body.appendChild(overlay);

            // bind ESC close
            this.body.addEventListener('keydown', this.modalKeyDown, false);

            window.addEventListener('pageshow', this.pageRefresh);

            // find modal header elements
            const closeTriggers = document.querySelectorAll('[data-dismiss=modal]');

            closeTriggers.forEach((trigger) => {
                // ok we found a close button - equip it to close modal
                trigger.onclick = () => {
                    this.close(targetModal);
                };
            });
        });
    }

    close(target) {
        // kill Escape key event listener
        this.body.removeEventListener('keydown', this.modalKeyDown, false);
        window.removeEventListener('pageshow', this.pageRefresh);
        // this is the related targetModal we're controlling
        const targetModals = typeof target === 'string' ? document.querySelectorAll(target) : [target];
        this.resetScrollbar();
        targetModals.forEach((targetModal) => {
            targetModal.classList.remove('show');
            targetModal.setAttribute('aria-hidden', true);
            targetModal.style.cssText = 'display: none;';

            // body modifications

            this.body.classList.remove('modal-open');
            this.body.style.cssText = '';

            const overlay = document.getElementById('overlay');
            if (overlay !== null) {
                const parent = overlay.parentNode;
                parent.removeChild(overlay);
            }
        });
    }
}

const modal = new Modal();

export default modal;
