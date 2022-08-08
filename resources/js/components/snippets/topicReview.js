import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TopicReview = (props) => {
    const { topic } = props;

    const [reviews, setReviews] = useState(topic.reviews);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const moreReviews = () => {
        if (!loading) {
            setLoading(true);
            fetch(`/api/hotel/topicReviews?id=${topic.refId}&topicId=${encodeURIComponent(topic.id)}&sentiment=${topic.sentiment}${page !== null ? `&page=${page}` : ''}`)
                .then((response) => response.json())
                .then((data) => {
                    setLoading(false);
                    const newReviews = [];
                    if (page > 0) {
                        newReviews.push(...reviews);
                    }

                    newReviews.push(...data.reviews);
                    setPage(page + 1);
                    setHasMore(data.hasMore);
                    setReviews(newReviews);
                });
        }
    };

    return (
        <>
            {reviews.map((review, revIndex) => (
                <>
                    {revIndex === 0 ? (<div className="font-italic">&quot;{review}&quot;</div>) : (<div className="pt-2 mt-2 border-top-dashed font-italic">&quot;{review}&quot;</div>)}
                </>
            ))}
            {hasMore && (
                <div className="text-right">
                    <button type="button" className="btn btn-link mt-2" onClick={moreReviews}>
                        More Reviews
                        <svg className="icon-sm" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
};

TopicReview.propTypes = {
    topic: PropTypes.instanceOf(Object).isRequired,
};

export default TopicReview;
