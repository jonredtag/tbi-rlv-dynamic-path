import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';
import SigninOption from '../common/SigninOption';

const SearchResults = (props) => {
    const {
        results,
        ResultComponent,
        onPaginate,
        resultProps,
        specialtyField,
        numberRecords,
        showSigninOptions,
        profileRef,
    } = props;


    const loadMore = () => {
        onPaginate();
    };

    return (
        <div className="col-12 col-xl-9">
            {specialtyField}
            <section className="search-results mt-3 mb-5 mt-md-0">
                {results.map((result, index) => (
                    <>
                    <ResultComponent key={`searchResult-${index}`} result={result} {...resultProps} index={index} />
                    {index === 2 && showSigninOptions && (<SigninOption profileRef={profileRef} />)}
                    </>
                ))}
                { (results.length > 0 && numberRecords > results.length) && <button type="button" className="load-more-results btn btn-light border mt-3 mx-auto" onClick={loadMore}>{Lang.trans('common.load_more_results')}</button>}
                { (results.length === 0) && <div className="alert alert-danger">{Lang.trans('dynamic.no_results_found_message')}</div> }
            </section>
        </div>
    );
};

SearchResults.defaultProps = {
    resultProps: {},
    specialtyField: '',
    numberRecords: 0,
    showSigninOptions: false,
};

SearchResults.propTypes = {
    results: PropTypes.instanceOf(Array).isRequired,
    ResultComponent: PropTypes.func.isRequired,
    onPaginate: PropTypes.func.isRequired,
    numberRecords: PropTypes.number,
    resultProps: PropTypes.instanceOf(Object),
    specialtyField: PropTypes.element,
    showSigninOptions: PropTypes.bool,
};

export default SearchResults;
