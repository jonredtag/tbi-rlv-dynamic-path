import React from 'react';

const HotelDetailsOverviewLoader = () => (
    <>
        <div className="mt-4">
            <div className="row pb-3 align-items-center justify-content-between title-and-price-container">
                <div className="col-lg-9 col-md-8">
                    <div className="loader-background py-3 mb-3" />
                    <div className="d-flex">
                        <div className="loader-background py-2 px-2 col-4 col-md-2 pb-3 mr-2" />
                        <div className="loader-background py-2 px-2 col-4 col-md-2 pb-3" />
                    </div>
                    <div className="d-none d-md-block mt-2 py-1">
                        <div className="d-flex">
                            <div className="col-3 py-2 pb-3 mr-2 loader-background" />
                            <div className="col-3 py-2 pb-3 mr-2 loader-background" />
                            <div className="col-3 py-2 pb-3 mr-2 loader-background" />
                            <div className="col-2 py-2 pb-3 mr-2 loader-background" />
                        </div>
                    </div>
                </div>
                <div className="text-right col-xl-2 col-lg-3 col-md-4 d-none d-md-block">
                    <div className="d-flex justify-content-end text-muted">
                        <div className=" loader-background py-1 col-2 mb-2" />
                    </div>
                    <div className="d-inline-block loader-background py-4 mb-2 col-7" />
                    <div className=" d-inline-block loader-background py-2 mb-2 col-10" />
                    <div className="loader-background py-3 d-inline-block col-8" />
                </div>
            </div>
        </div>
        <div className="mt-2">
            <div className="loader-background py-5 d-md-none" />
            <div className="loader-background py-5 d-md-none" />
            <div className="row gutter-10 gallery-lightbox-preview d-none d-md-flex">
                <div className="col-7 h-100 loader-background" />
                <div className="col-5 h-100">
                    <div className="row h-50 gutter-10">
                        <div className="col-lg-6 pb-2 pb-lg-0 h-100 overlay-parent">
                            <div className="loader-background h-100" />
                        </div>
                        <div className="col-lg-6 h-100">
                            <div className="pb-2 h-50 overlay-parent">
                                <div className="h-100 loader-background" />
                            </div>
                            <div className="overlay-parent h-50">
                                <div className="h-100 loader-background" />
                            </div>
                        </div>
                    </div>
                    <div className="row h-50 gutter-10 pt-2 ">
                        <div className="col-12 h-100 d-none d-lg-block overlay-parent">
                            <div className="loader-background h-100" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default HotelDetailsOverviewLoader;
