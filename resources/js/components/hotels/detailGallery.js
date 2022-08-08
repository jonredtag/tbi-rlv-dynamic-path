import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import DetailsBlurb from 'components/hotels/detailBlurb';
import MapCTA from 'components/hotels/detailMapCTA';
import TrustYouReviewSummary from 'components/hotels/trustYouReviewSummary';
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
        const { hotel } = this.props;
        const images = [];
        const defaultImage = 'https://travel-img.s3.amazonaws.com/2020-07-14--15947010820462no-photo.png';
        hotel.gallery.forEach((item) => {
            if (item.image.indexOf('jpg') > -1 && (item.image.match(/\//g) || []).length >= 3) {
                images.push((item.image !== null && item.image !== '') ? item.image : defaultImage);
            }
        });
        this.setState({ images });
    }

    toggleLightbox(index) {
        this.setState((state) => ({ index, lightbox: !state.lightbox }));
    }

    render() {
        const { hotel } = this.props;
        const { lightbox, index, images } = this.state;

        return (
            <>
                {(lightbox && images.length > 0) && (
                    <Lightbox
                        imageTitle={`${hotel.name} - Image ${index + 1} / ${images.length}`}
                        mainSrc={images[index]}
                        nextSrc={images[(index + 1) % images.length]}
                        prevSrc={images[(index + images.length - 1) % images.length]}
                        onCloseRequest={() => this.setState({ lightbox: false })}
                        onMovePrevRequest={() => this.setState({ index: (index + images.length - 1) % images.length })}
                        onMoveNextRequest={() => this.setState({ index: (index + 1) % images.length })}
                    />
                )}
                <div className="row gutter-10 gallery-lightbox-preview d-flex">
                    <div className="col-12 col-md-7 col-lg-6 h-100 overlay-parent">
                        <div className="overlay-background h-100 rounded">
                            <img className="w-100 h-100 d-block preview-image" src={images[0]} alt="" />
                        </div>
                    </div>
                    <div className="d-none d-md-block col-md-5 col-lg-6 h-100">
                        <div className="col-md-12 col-12 h-100 pt-2 p-0 pt-md-0">
                            <div className="row h-50 gutter-10">
                                <div className="col-6 col-md-12 col-lg-6 pb-2 pb-lg-0 h-100 overlay-parent">
                                    <div className="h-100 overlay-background rounded">
                                        <img className="rounded preview-image w-100 h-100" src={images[1]} width="100%" height="100%" alt="" />
                                    </div>
                                </div>
                                <div className="col-6 pb-2 pb-lg-0 h-100 d-none d-lg-block overlay-parent">
                                    <div className="h-100 overlay-background rounded">
                                        <img className="rounded preview-image w-100 h-100" src={images[2]} width="100%" height="100%" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="row h-50 gutter-10 pt-2">
                                <div className="col-6 col-md-12 col-lg-6 h-100 overlay-parent">
                                    <div className="h-100 overlay-background rounded">
                                        <img className="rounded preview-image w-100 h-100" src={images[3]} width="100%" height="100%" alt="" />
                                    </div>
                                </div>
                                <div className="col-6 pb-2 pb-lg-0 h-100 d-none d-lg-block overlay-parent">
                                    <div className="h-100 overlay-background rounded">
                                        <img className="rounded preview-image w-100 h-100" src={images[4]} width="100%" height="100%" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="position-relative col-12">
                        <div className="open-gallery-btn w-100 d-flex align-items-center justify-content-center">
                            <button type="button" className="text btn btn-gallery btn-lg px-3" onClick={() => this.toggleLightbox(0)}>
                                <svg className="icon-md icon-map mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-gallery" />
                                </svg>
                                Show All Photos
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div className="row gutter-10 gallery-lightbox-preview  d-flex">
                    <div className="col-12 col-md-7 h-100 overlay-parent">
                        <div className="overlay-background h-100">
                            { images.length >= 1 && <img onClick={() => this.toggleLightbox(0)} className="w-100 h-100 d-block preview-image" src={images[0]} alt="" /> }
                        </div>
                        {images.length > 1 && (
                            <div className="position-relative">
                                <div className="open-gallery-btn w-100 d-flex align-items-center justify-content-center">
                                    <button onClick={() => this.toggleLightbox(0)} type="button" className="text btn btn-gallery btn-lg px-3">
                                        <svg className="icon-md icon-map mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-gallery" />
                                        </svg>
                                        +{images.length - 1}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="d-none d-md-block col-md-5 h-100">
                        {hotel.propertyDescription !== '' && (
                            <DetailsBlurb hotel={hotel} />
                        )}
                        <MapCTA />
                    </div>
                </div> */}

            </>
        );
    }
}

DetailGallery.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
};

export default DetailGallery;
