class Tooltip {
    constructor() {
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    init() {
        const app = document.getElementById('app');

        const tooltips = app.querySelectorAll('.tooltipParent');

        for (const tooltip of tooltips) {
            tooltip.addEventListener('mouseenter', this.showTooltip);
            tooltip.addEventListener('mouseleave', this.hideTooltip);
        }
    }

    showTooltip(event) {
        let node = event.target;

        while (!node.classList.contains('tooltipParent')) {
            node = node.parentNode;
        }

        const tooltip = node.querySelector('.tooltip');

        tooltip.classList.add('show');
        tooltip.classList.remove('hide');
    }

    hideTooltip(event) {
        let node = event.target;

        while (!node.classList.contains('tooltipParent')) {
            node = node.parentNode;
        }

        const tooltip = node.querySelector('.tooltip');

        tooltip.classList.remove('show');
        tooltip.classList.add('hide');
    }
}

export default Tooltip;
