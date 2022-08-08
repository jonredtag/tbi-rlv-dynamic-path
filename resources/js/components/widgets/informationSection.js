import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'reactstrap/lib/Collapse';
import uniqueID from 'helpers/uniqueID';
import Lang from 'libraries/common/Lang';

const InformationSection = (props) => {
    const { title, content } = props;

    const [show, setShow] = useState(true);
    const [status, setStatus] = useState(true);

    const toggle = () => {
        setShow(!show);
        setStatus(!status);
    };

    return (
        <div className="rounded-sm p-3 mb-3 box-shadow bg-white">
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center primary-color">
                    <div className="mr-2 mt-2 d-none">
                        <svg className="icon-md" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-info-circle" />
                        </svg>
                    </div>
                    <h5 className="m-0 font-weight-bold">{title}</h5>
                </div>
                <button type="button" className="btn-underline-link" onClick={toggle}>
                    {status ? Lang.trans('common.close_tab') : Lang.trans('common.open_tab')}
                </button>
            </div>
            <Collapse isOpen={show} className="mt-3">
                {content.map((information) => (
                    <p key={`${uniqueID()}`} dangerouslySetInnerHTML={{ __html: information.paragraph_0 }} />
                ))}
            </Collapse>
        </div>
    );
};

InformationSection.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.instanceOf(Array).isRequired,
};

export default InformationSection;
