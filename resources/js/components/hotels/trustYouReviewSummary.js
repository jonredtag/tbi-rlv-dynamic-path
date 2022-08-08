import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-scroll';

const TrustYouReviewSummary = (props) => {
    const { data } = props;

    return (
        <div className="col-12 d-none d-md-block my-3 p-0">
            <div className="ratings-reviews clearfix d-none d-md-block pr-md-3">
                <div className="clearfix">
                    <div className=" d-none d-md-block">
                        <div className="row gutter-10">
                            <div className="col-12 col-md-6 col-lg-3 col-xl-4">
                                {data.summary && (
                                    <div className="infor">
                                        <strong>{data.summary}</strong>
                                    </div>
                                )}
                                {data.badges.length > 0 && (
                                    <div className="hotel-type">
                                        {data.badges.map((badge) => (
                                            <p>
                                                <i className="ty-icon ty-icon-16z" />
                                                {badge.text} – <em>{badge.subtext}</em>
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <iframe width="90%" frameborder="0" src={`https://api.trustyou.com/hotels/${data.trustyouID}/seal.html?lang=${window.Locale}&key=e322d37b-ae0d-4d1f-ace9-40ebd855b983`} />
                            </div>
                            {data.ratings.length > 0 && (
                                <div className="col-12 col-lg-5 col-xl-4">
                                    <div className="distribution">
                                        {data.ratings.map((rating) => (
                                            <div className="rating-level pos">
                                                <div className="rating-value">
                                                    <svg className="icon star" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                                    </svg>
                                                    {rating.value}
                                                </div>
                                                <div className="rating-chart">
                                                    <div className="rating-chart-value" style={{ width: `${rating.percentage}%` }} />
                                                </div>
                                                <div className="rating-count">{rating.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Link className="more-reviews d-none d-md-block" to="reviews" smooth spy offset={-75}>
                    More Reviews
                    <svg className="icon chevron-right" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

TrustYouReviewSummary.propTypes = {
    data: PropTypes.instanceOf(Object).isRequired,
};

export default TrustYouReviewSummary;
