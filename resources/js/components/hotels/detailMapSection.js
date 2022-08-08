import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import numberFormat from 'helpers/numberFormat';
import Lang from 'libraries/common/Lang';

const handleApiLoaded = (map, maps, hotel) => {
    const markers = [];
    const svgMarker = {
        path: 'M-625.9 395.9c0-.7.1-1.3.4-1.9.3-.6.6-1.2 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2-.4s1.3.1 1.9.4c.6.2 1.2.6 1.6 1.1.5.4.8 1 1.1 1.6.3.6.4 1.3.4 1.9s-.1 1.3-.4 1.9-.6 1.1-1.1 1.6c-.4.5-1 .8-1.6 1.1-.6.3-1.2.4-1.9.4s-1.4-.1-2-.4c-.6-.3-1.1-.6-1.6-1.1-.4-.5-.8-1-1.1-1.6-.2-.6-.4-1.2-.4-1.9zm-3.5.6c0 .5.1 1.2.4 1.9s.6 1.5.9 2.2c.3.7.8 1.5 1.3 2.5l6 10 5.6-10c.6-1 1.1-1.8 1.4-2.5.4-.7.7-1.4 1-2.2.3-.7.5-1.4.5-1.9 0-1.2-.2-2.3-.7-3.3-.4-1-1-1.9-1.8-2.7-.8-.8-1.7-1.4-2.7-1.8-1-.4-2.1-.7-3.3-.7-1.2 0-2.3.2-3.3.7-1 .4-1.9 1-2.7 1.8-.8.8-1.4 1.7-1.8 2.7-.5 1-.8 2.1-.8 3.3z',
        fillOpacity: 1,
        rotation: 0,
        scale: 1,
        anchor: new maps.Point(-620.6, 413),
    };

    markers.push(new maps.Marker({
        position: {
            lat: hotel.latitude,
            lng: hotel.longitude,
        },
        icon: svgMarker,
        map,
    }));
};

class DetailMapSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMap: false,
            center: {
                lat: props.hotel.latitude,
                lng: props.hotel.longitude,
            },
            zoom: 9,
        };

        this.renderMap = this.renderMap.bind(this);
    }

    renderMap() {
        this.setState((state) => ({ showMap: true }));
    }

    render() {
        const { googleKey, hotel } = this.props;
        const { showMap, center, zoom } = this.state;
        return (
            <div className="row">
                <div className=" col-12 col-md-6 col-lg-7">
                    <div className="mb-2 position-relative">
                        { !showMap && (
                            <>
                                <button type="button" className="btn-unstyled click-map-text h3 mb-0 text-white position-absolute w-100 h-100 d-flex align-items-center justify-content-center" onClick={this.renderMap}>
                                    <div className="map-text d-flex align-items-center">
                                        {Lang.trans('dynamic.click_to_see_map')}
                                    </div>
                                </button>
                                <img className="image-map w-100 h-100 rounded" src="https://travel-img.s3.amazonaws.com/2019-10-23--15718614125067map-image.gif" alt="" />
                            </>
                        )}
                        { showMap && (
                            <div style={{ height: '50vh', width: '100%' }}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: googleKey }}
                                    defaultCenter={center}
                                    defaultZoom={zoom}
                                    yesIWantToUseGoogleMapApiInternals
                                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps, hotel)}
                                />
                            </div>
                        ) }
                    </div>
                    <span className="py-2 primary-color">{hotel.address}</span>
                </div>
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="row gutter-10 pt-2">
                        <div className="col-12">
                            <h5 className="font-weight-bold">Things To Do In This Area</h5>
                        </div>
                        <div className="col-12">
                            {hotel.landmarks.map((POI) => (
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <svg className="icon mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                        </svg>
                                        <span className="mt-1">{POI.name}</span>
                                    </div>
                                    <span className="mt-1">{numberFormat({ value: POI.distance })} mile</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DetailMapSection.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
};

export default DetailMapSection;
