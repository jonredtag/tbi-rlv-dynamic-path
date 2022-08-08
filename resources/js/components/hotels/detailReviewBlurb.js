import React from 'react';
import { Link } from 'react-scroll';
import moment from 'moment';
import Icons from 'libraries/common/Icons';
import Lang from 'libraries/common/Lang';

const DetailReviewBlurb = (props) => {
    const { reviews } = props;
    const list = (reviews.length > 0 && reviews[0].list !== undefined) ? reviews[0].list : [];
    if (!list.length) {
        return null;
    }
    const summary = (reviews.length > 0 && reviews[0].summary !== undefined) ? reviews[0].summary : {};
    const review = list.length && list[0].review_0 !== undefined ? list[0].review_0 : '';
    const rating = Math.round(parseFloat(review.average_rating));
    const date = moment(review.creation_date);
    let ratingClass;

    if (rating <= 6) {
        ratingClass = 'average-okay';
    }
    if (rating > 6 && rating <= 8) {
        ratingClass = 'average-good';
    }
    if (rating > 8) {
        ratingClass = 'average-excellent';
    }
    return (
        <div className="border rounded p-3 reviews-blurb clearfix my-3 my-md-0 w-100">
            <div className="d-flex align-items-center">
                <div className={`text-white rating-number rounded p-1 d-inline-block font-weight-bold mr-2 d-flex align-items-center justify-content-center ${ratingClass}`}><strong>{review.average_rating}</strong></div>
                <div className="d-lg-flex d-md-block d-flex w-100">
                    <div className="review-avg-description review-bold-font font-weight-bold">{review.average_rating_description}</div>
                    <div className="review-date review-light-grey-font review-light-grey-font ml-auto">{date.format('ll')}</div>
                </div>
            </div>
            <div className="my-1 mt-3">
                <strong className="review-bold-font font-weight-bold pr-2">{Lang.trans('dynamic.review_question_good')}</strong>
                {review.good_description}
            </div>
            { review.bad_description !== '' && (
                <div className="my-1 mb-3">
                    <strong className="review-bold-font font-weight-bold pr-2">{Lang.trans('dynamic.review_question_bad')}</strong>
                    {review.bad_description}
                </div>
            )}
            <div className="font-weight-bold ellipsis">
                <svg className="icon icon-user mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <use xlinkHref={Icons.path('user')} />
                </svg>
                {review.user_name}
            </div>
            <div className="review-light-grey-font">{review.traveller_type_name}</div>
            <Link to="reviews" smooth spy className="mt-3 d-block text-secondary">
                {Lang.trans('dynamic.more_reviews')}
                <svg className="icon chevron-right text-secondary ml-2">
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                </svg>
            </Link>
        </div>
    );
};

export default DetailReviewBlurb;
