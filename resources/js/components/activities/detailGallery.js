import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-scroll';

class DetailGallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lightbox: false,
            index: 0,
            images: [],
        };
        this.toggleLightbox = this.toggleLightbox.bind(this);
    }

    componentDidMount() {
        const { entity } = this.props;
        const images = [];
        const defaultImage = 'https://travel-img.s3.amazonaws.com/2020-07-14--15947010820462no-photo.png';
        entity.gallery.forEach((item) => {
            if (item.image && (item.image.match(/\//g) || []).length >= 3) {
                images.push(item.image !== null && item.image !== '' ? item.image : defaultImage);
            }
        });
        this.setState({ images });
    }

    toggleLightbox(index) {
        this.setState((state) => ({ index, lightbox: !state.lightbox }));
    }

    render() {
        const { entity, entityName } = this.props;
        const { lightbox, index, images } = this.state;

        return (
            <>
                {lightbox && images.length > 0 && (
                    <Lightbox
                        imageTitle={`${entity.name} - Image ${index + 1} / ${images.length}`}
                        mainSrc={images[index]}
                        nextSrc={images[(index + 1) % images.length]}
                        prevSrc={images[(index + images.length - 1) % images.length]}
                        onCloseRequest={() => this.setState({ lightbox: false })}
                        onMovePrevRequest={() => this.setState({ index: (index + images.length - 1) % images.length })}
                        onMoveNextRequest={() => this.setState({ index: (index + 1) % images.length })}
                    />
                )}
                
                    
                <div className="overlay-background h-100">
                    {images.length >= 1 && (
                        <img
                            onClick={() => this.toggleLightbox(0)}
                            className="w-100 h-100 d-block preview-image"
                            src={images[0]}
                            alt=""
                        />
                    )}
                </div>
                {images.length > 1 && (
                    <div className="position-relative">
                        <div className="open-gallery-btn w-100 d-flex align-items-center justify-content-center">
                            <button
                                onClick={() => this.toggleLightbox(0)}
                                type="button"
                                className="text btn btn-gallery btn-lg px-3"
                            >
                                <svg
                                    className="icon-md icon-map mr-1"
                                    width="100%"
                                    height="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-gallery" />
                                </svg>
                                +{images.length - 1}
                            </button>
                        </div>
                    </div>
                )}                        
            </>
        );
    }
}

DetailGallery.propTypes = {
    entity: PropTypes.instanceOf(Object).isRequired,
    entityName: PropTypes.string.isRequired,
};

export default DetailGallery;
