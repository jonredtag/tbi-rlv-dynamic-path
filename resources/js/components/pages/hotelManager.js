import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CityAutocomplete from 'components/widgets/autocompletes/cityAutocomplete';
import HotelAutocomplete from 'components/widgets/autocompletes/hotelAutocomplete';
import Lang from 'libraries/common/Lang';
import HotelResultsLoader from 'components/widgets/hotelResultsLoader';
import Stars from 'components/widgets/stars';

class HotelManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: {},
            hotel: {},
            searchBy: 'city',
            results: null,
            loading: false,
            sequences: [],
            page: 1,
            perPage: 50,
            pages: [],
        };

        this.selectCity = this.selectCity.bind(this);
        this.selectHotel = this.selectHotel.bind(this);
        this.search = this.search.bind(this);
        this.update = this.update.bind(this);
        this.saveSequence = this.saveSequence.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
    }

    saveSequence(e) {
        const { sequences } = this.state;
        const { dataset } = e.currentTarget;
        if (sequences[dataset.index].sequence === e.target.value) {
            return;
        }
        sequences[dataset.index].sequence = parseInt(e.target.value, 10);
        sequences[dataset.index].changed = true;
        this.setState({ sequences });
    }

    selectCity(item) {
        this.setState({ city: item, searchBy: 'city' });
    }

    selectHotel(item) {
        this.setState({ hotel: item, searchBy: 'hotel', page: 1 });
    }

    gotoPage(page) {
        this.setState({ page }, this.search);
    }
    search() {
        const {
            searchBy,
            city,
            hotel,
            page,
        } = this.state;
        const data = { city, hotel };
        if (!Object.prototype.hasOwnProperty.call(data[searchBy], 'value')) {
            return;
        }
        this.setState({ loading: true });
        const { value } = data[searchBy];
        fetch(`/api/admin/search/${searchBy}/${value}?page=${page}`)
            .then((response) => response.json())
            .then((response) => {
                const sequences = response.data.map((row) => {
                    const ob = {};
                    ob.id = row.intGlCode;
                    ob.sequence = row.SequenceNumber === null ? 0 : row.SequenceNumber;
                    return ob;
                });
                const pages = [];
                for (let i = 1; i <= response.last_page; i++) {
                    pages.push(i);
                }
                this.setState({ results: response, loading: false, sequences, pages });
            });
    }

    // save all sequences
    update() {
        const {
            sequences,
            searchBy,
            city,
            hotel
        } = this.state;
        const data = { city, hotel };
        const changed = sequences.filter(entry => entry.changed !== undefined && entry.changed === true);
        if (!Object.prototype.hasOwnProperty.call(data[searchBy], 'value') || changed.length === 0) {
            return;
        }
        fetch(`/api/admin/update/${searchBy}/${data[searchBy].value}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changed),
        })
            .then((response) => response.json())
            .then((response) => {
                // search again to update sequencing
                this.search();
            });
    }

    render() {
        const {
            city,
            hotel,
            results,
            searchBy,
            loading,
            sequences,
            pages,
            page,
        } = this.state;
        const displayErrors = {};
        return (
            <>
                <div className="mt-5">
                    <div className="row">
                        <div className="col-12 col-md-5">
                            <div className={`p-2 ${searchBy === 'city' ? 'alert-success' : ''}`}>
                                <label className="d-none d-md-block input-header" htmlFor="dyn_return">Search by City</label>
                                <div className="element-container">
                                    <label className="icon left" htmlFor="adm_cities">
                                    <svg width="100%" height="100%" role="img" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                    </svg>
                                    </label>
                                    <div className="element-wrapper">
                                        <CityAutocomplete
                                        clearButton
                                        placeholder={Lang.trans('engine.from')}
                                        id="adm_cities"
                                        value={city.text || ''}
                                        onSelect={this.selectCity}
                                        icon="iata"
                                        />
                                        {displayErrors.city || ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-5">
                            <div className={`p-2 ${searchBy === 'hotel' ? 'alert-success' : ''}`}>
                                <label className="d-none d-md-block input-header" htmlFor="dyn_return">Search by Hotel</label>
                                <div className="element-container">
                                    <label className="icon left" htmlFor="adm_cities">
                                    <svg width="100%" height="100%" role="img" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                    </svg>
                                    </label>
                                    <div className="element-wrapper">
                                        <HotelAutocomplete
                                            clearButton
                                            placeholder="Search by Hotel"
                                            id="adm_hotels"
                                            value={hotel.text || ''}
                                            onSelect={this.selectHotel}
                                            icon="iata"
                                        />
                                        {displayErrors.hotel || ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-2">
                            <button onClick={this.search} type="button" className="btn btn-primary btn-lg btn-block mb-3 mb-md-0 mt-md-4">Search</button>
                        </div>
                    </div>
                    {loading === true && <HotelResultsLoader />}

                    {(!loading && results !== null && results.data.length > 0) && (
                        <div className="results">
                            { results.last_page > 1 && (
                                <div className="hotel-manager-pagination my-3 border p-3 text-center">
                                    <div className="row align-items-center">
                                        <div className="col-12 col-md-3">
                                            <h4>{results.total} hotels found</h4>
                                        </div>
                                        <div className="col-12 col-md-9">
                                            <div className="btn-group" role="group" aria-label="Pages">
                                                {page > 1 && (
                                                    <button onClick={() => this.gotoPage((page - 1) % 1)} type="button" className="btn btn-dark">Prev</button>
                                                )}
                                                {
                                                    pages.map((p) => <button key={`pagination-page-button-${p}`} onClick={() => this.gotoPage(p)} type="button" className={`btn ${page === p ? 'btn-secondary' : 'btn-dark'}`}>{p}</button>)
                                                }
                                                {page < results.last_page && (
                                                    <button onClick={() => this.gotoPage((page + 1) % results.last_page)} type="button" className="btn btn-dark">Next</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            { results.data.map((row, index) => (
                                <div key={`admin-hotel-results-${row.intGlCode}`} className="hotel-manager-card card card-default mt-2">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12 col-md-5">
                                                <h5>{row.DisplayName}</h5>
                                                <Stars component="hotelManager" rating={parseFloat(row.StarRating, 10)} />
                                            </div>
                                            <div className="col-12 col-md-3">
                                                <p>{row.Address}<br />{row.CityName}, {row.CountryName}</p>
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <span>Sequence:</span>
                                                <input className="form-control sequence-number-input mb-2 mb-md-0" data-index={index} onChange={this.saveSequence} value={sequences[index].sequence} />
                                            </div>
                                            <div className="col-12 col-md-2">
                                                <button onClick={this.update} type="button" className="btn btn-secondary btn-block mb-3 mb-md-0 mt-md-4">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    }
}

HotelManager.propTypes = {
    parameters: PropTypes.instanceOf(Object).isRequired,
};

export default HotelManager;