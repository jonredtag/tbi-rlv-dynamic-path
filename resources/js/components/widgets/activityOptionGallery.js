import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

class ActivityOptionGallery extends Component {
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

    toggleLightbox(index,e) {
        e.preventDefault();
        this.setState((state) => ({ index, lightbox: !state.lightbox }));
    }

    render() {
        const { entity } = this.props;
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
                {images.length >= 1 && (
                    <a href="#" onClick={(e) => this.toggleLightbox(0,e)}
                        ><img
                        className="w-100"
                        src={images[0]}
                        alt=""
                        />
                    </a>
                )}
            </>
        );
    }
}

ActivityOptionGallery.propTypes = {
    entity: PropTypes.instanceOf(Object).isRequired,
    entityName: PropTypes.string.isRequired,
};

export default ActivityOptionGallery;
