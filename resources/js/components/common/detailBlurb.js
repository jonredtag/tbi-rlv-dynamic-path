import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-scroll';
import Lang from 'libraries/common/Lang';

const DetailsBlurb = (props) => {
    const { entity, entityName } = props;

    return (
        <div className="row h-50 gutter-10">
            <div className="description-preview border d-flex rounded col-12 order-1 order-md-0">
                <div className="p-3">
                    <h4 className="mb-2 font-weight-bold">About this {entityName}</h4>
                    <div className="overflow-hide" dangerouslySetInnerHTML={{ __html: entity.propertyDescription }} />
                    <Link to="details" smooth spy className="rounded d-inline-block py-1 pr-3 font-weight-bold mt-3">
                        {Lang.trans('buttons.see_all_details')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

DetailsBlurb.propTypes = {
    entity: PropTypes.instanceOf(Object).isRequired,
    entityName: PropTypes.string.isRequired,
};

export default DetailsBlurb;
