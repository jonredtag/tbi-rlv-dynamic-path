import React from 'react';
import PropTypes from 'prop-types';

const DetailPolicies = (props) => {
    const { policies } = props;

    return (
        <>
            <h5 className="mb-4 font-weight-bold">Policies</h5>
            <div className="row">
                {policies.map((policy) => (
                    <div className="col-12 col-md-6 mb-2">
                        <h6 className="mb-2 font-weight-bold">{policy.title}</h6>
                        <ul className="list-unstyled">
                            <li dangerouslySetInnerHTML={{ __html: policy.content }} />
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

DetailPolicies.propTypes = {
    policies: PropTypes.instanceOf(Array).isRequired,
};

export default DetailPolicies;
