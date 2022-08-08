import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Carousel extends Component {
    constructor(props) {
        super(props);

        const defaults = {
            duration: 200,
            easing: 'ease-out',
            perPage: 1,
            startIndex: 0,
            draggable: true,
            threshold: 20,
            loop: false,
            nav: null,
            rotate: true,
            interval: 5000,
            prev: null,
            next: null,
            counter: false,
        };
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.touchendHandler = this.touchendHandler.bind(this);
        this.touchmoveHandler = this.touchmoveHandler.bind(this);
        this.mousedownHandler = this.mousedownHandler.bind(this);
        this.mouseupHandler = this.mouseupHandler.bind(this);
        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.mouseleaveHandler = this.mouseleaveHandler.bind(this);
        this.preventDraggedAnchors = this.preventDraggedAnchors.bind(this);


        // refs
        this.container = React.createRef();
        this.track = React.createRef();


        const config = Object.assign(defaults, props.config);

        const transformProperty = (() => {
            const style = document.documentElement.style;
            if (typeof style.transform === 'string') {
                return 'transform';
            }
            return 'WebkitTransform';
        })();


        this.id = Math.random().toString(36).substring(7);
        this.idPrefix = 'carouselTrack';
        this.idSeparator = '-';
        this.pointerDown = false;
        this.dragging = false;
        this.drag = {
            start: 0,
            end: 0,
        };
        this.state = {
            perPage: 3,
            containerWidth: 1140,
            config,
            currentSlide: 0,
            transformProperty,
            windowWidth: 0,
            windowHeight: 0,
            instant: false,
        };
    }


    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions();
        this.preventDraggedAnchors();
    }

    carouselId() {
        return `${this.idPrefix}${this.idSeparator}${this.id}`;
    }

    preventDraggedAnchors() {
        const id = this.carouselId();
        const draggedAnchors = document.querySelectorAll(`#${id} a`);
        if (draggedAnchors.length) {
            for (let i = 0; i < draggedAnchors.length; i++) {
                draggedAnchors[i].addEventListener('click', (e) => {
                    if (this.dragging) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }
        }
    }

    updateDimensions() {

        const { config } = this.state;
        let perPage = 1;
        if (typeof config.perPage === 'object') {
            for (const viewport in config.perPage) {
                if (window.innerWidth >= viewport) {
                    perPage = config.perPage[viewport];
                }
            }
        }

        const containerWidth = this.container.current.getBoundingClientRect().width;
        this.setState({ containerWidth, perPage, windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    }


    prev() {
        const { config, perPage, currentSlide } = this.state;
        const { children } = this.props;
        let slideIndex = 0;
        if (currentSlide === 0 && config.loop) {
            slideIndex = children.length - perPage;
        } else {
            slideIndex = Math.max(currentSlide - perPage, 0);
        }

        this.setState({ currentSlide: slideIndex });
    }

    next() {
        const { config, perPage, currentSlide } = this.state;
        const { children } = this.props;
        let slideIndex = 0;
        if (children.length <= currentSlide + perPage && config.loop) {
            slideIndex = 0;
        } else {
            slideIndex = Math.min(currentSlide + perPage, children.length - perPage);
        }
        this.setState({ currentSlide: slideIndex });
    }

    touchstartHandler(e) {
        e.stopPropagation();
        this.pointerDown = true;
        this.drag.start = e.touches[0].pageX;
    }
    touchendHandler(e) {
        const { config } = this.state;
        e.stopPropagation();
        this.pointerDown = false;
        this.track.current.style.webkitTransition = `all ${config.duration}ms ${config.easing}`;
        this.track.current.style.transition = `all ${config.duration}ms ${config.easing}`;
        if (this.drag.end) {
            this.updateAfterDrag();
        }
        this.clearDrag();
    }
    touchmoveHandler(e) {
        const { config, transformProperty, containerWidth, perPage, currentSlide } = this.state;
        e.stopPropagation();
        if (this.pointerDown) {
            this.drag.end = e.touches[0].pageX;
            this.track.current.style.webkitTransition = `all 0ms ${config.easing}`;
            this.track.current.style.transition = `all 0ms ${config.easing}`;
            this.track.current.style[transformProperty] = `translate3d(${((currentSlide * (containerWidth / perPage)) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
        }
    }

    // Mouse events handlers
    mousedownHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        this.pointerDown = true;
        this.drag.start = e.pageX;
    }
    mouseupHandler(e) {
        const { config } = this.state;
        e.stopPropagation();
        this.pointerDown = false;
        this.track.current.style.cursor = '-webkit-grab';
        this.track.current.style.webkitTransition = `all ${config.duration}ms ${config.easing}`;
        this.track.current.style.transition = `all ${config.duration}ms ${config.easing}`;
        if (this.drag.end) {
            this.updateAfterDrag();
        }
        this.clearDrag();
    }
    mousemoveHandler(e) {
        const { config, transformProperty, containerWidth, perPage, currentSlide } = this.state;
        e.preventDefault();
        if (this.pointerDown) {
            this.dragging = true;
            this.drag.end = e.pageX;
            this.track.current.style.cursor = '-webkit-grabbing';
            this.track.current.style.webkitTransition = `all 0ms ${config.easing}`;
            this.track.current.style.transition = `all 0ms ${config.easing}`;
            this.track.current.style[transformProperty] = `translate3d(${((currentSlide * (containerWidth / perPage)) + (this.drag.start - this.drag.end)) * -1}px, 0, 0)`;
        }
    }
    mouseleaveHandler(e) {
        const { config } = this.state;
        if (this.pointerDown) {
            this.pointerDown = false;
            this.drag.end = e.pageX;
            this.track.current.style.webkitTransition = `all ${config.duration}ms ${config.easing}`;
            this.track.current.style.transition = `all ${config.duration}ms ${config.easing}`;
            this.updateAfterDrag();
            this.clearDrag();
        }
    }

    updateAfterDrag() {
        const { config } = this.state;
        const movement = this.drag.end - this.drag.start;
        if (movement > 0 && Math.abs(movement) > config.threshold) {
            this.prev();
        } else if (movement < 0 && Math.abs(movement) > config.threshold) {
            this.next();
        }
        setTimeout(() => {
            this.dragging = false;
        }, 1000);
    }

    clearDrag() {
        this.drag = {
            start: 0,
            end: 0,
        };
    }

    reload() {
        this.setState({ instant: true });
        setTimeout(this.updateDimensions);
        setTimeout(() => this.setState({ instant: false }), 1000);
    }

    render() {
        const {
            perPage,
            containerWidth,
            config,
            transformProperty,
            currentSlide,
            instant,
        } = this.state;

        const {
            className,
            children,
        } = this.props;

        const childWrapperStyle = { float: 'left', width: `${100 / children.length}%` };
        const rootStyle = { overflow: 'hidden' };

        const frameStyle = {};
        frameStyle.width = `${(containerWidth / perPage) * children.length}px`;

        if (!instant) {
            frameStyle.WebkitTransition = `all ${config.duration}ms ${config.easing}`;
            frameStyle.transition = `all ${config.duration}ms ${config.easing}`;
        }

        frameStyle[transformProperty] = `translate3d(-${(currentSlide * (containerWidth / perPage))}px, 0, 0)`;

        const trackClasses = (this.dragging) ? 'dragging' : '';

        const id = this.carouselId();

        return (
            <div className="col-12 slider-mask image-gallery single-image hotel-photo-gallery backend ">
                <div className="slider-wrapper">
                    <div className="tbody row no-gutters ">
                        <div ref={this.container} className={className} style={rootStyle}>
                            <div
                                role="presentation"
                                id={id}
                                className={`carousel-track ${trackClasses}`}
                                ref={this.track}
                                onTouchStart={this.touchstartHandler}
                                onTouchEnd={this.touchendHandler}
                                onTouchMove={this.touchmoveHandler}
                                onMouseDown={this.mousedownHandler}
                                onMouseUp={this.mouseupHandler}
                                onMouseLeave={this.mouseleaveHandler}
                                onMouseMove={this.mousemoveHandler}
                                style={frameStyle}
                            >
                                {children.map((element, index) => {
                                    return (
                                        <div key={`carousel-child-${index}`} className="d-inline-block mb-2 mb-md-0" style={childWrapperStyle}>{element}</div>
                                    );
                                })}
                            </div>
                            <button onClick={this.prev} className="prev btn-low-importance-gradient btn-left box-shadow" rel="nofollow">
                    <svg className="icon" role="img" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-chevron-left`} />
                    </svg> 
                </button>
                <button onClick={this.next} className="next btn-low-importance-gradient btn-right  box-shadow" rel="nofollow" >                              
                    <svg className="icon"  role="img" title="">
                        <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-chevron-right`} />
                    </svg> 
                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Carousel.propTypes = {
    className: PropTypes.string,
    children: PropTypes.instanceOf().isRequired,
};

Carousel.defaultProps = {
    className: '',
};

export default Carousel;
