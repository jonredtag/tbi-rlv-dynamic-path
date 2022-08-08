import React from 'react';
import PropTypes from 'prop-types';
import ErrorText from 'components/snippets/errorText';
import Lang from 'libraries/common/Lang';

const HotelOccupancy = (props) => {
    const {
        onVisibilityChange,
        occupancy,
        onChange,
        errors,
        validateField,
        visible,
        hasRooms,
        selectedProducts
    } = props;

    const countGuests = () => {
        let guests = 0;

        occupancy.forEach((room) => {
            guests += room.adults + room.children;
        });
        return guests;
    };

    const clickGuest = () => {
        onVisibilityChange(!visible);
    };

    const changeOccupancy = (event, element) => {
        const value = parseInt(event.target.value, 10);
        let renderOccupancy = [{ adults: 0, children: 0, ages: [] }];
        if (hasRooms || occupancy.length === 1) {
            renderOccupancy = occupancy;
        } else {
            occupancy.forEach((room) => {
                renderOccupancy[0].adults += room.adults;
                renderOccupancy[0].children += room.children;
                renderOccupancy[0].ages.push(...room.ages);
            });
        }
        const parts = element.split('-');
        const room = Object.assign({}, renderOccupancy[parts[0]]);

        if (parts[1] === 'adults') {
            room.adults = value;
        } else if (parts[1] === 'children') {
            let ages = Object.assign([], renderOccupancy[parts[0]].ages);

            if (ages.length < value) {
                for (let i = ages.length; i < value; i++) {
                    ages.push('');
                }
            } else {
                ages = ages.slice(0, value);
            }
            room.children = value;
            room.ages = ages;
        } else if (parts[1] === 'childAge') {
            room.ages[parts[2]] = value;
        }

        const newOccupancy = [...renderOccupancy.slice(0, [parts[0]]), room, ...renderOccupancy.slice(parseInt(parts[0], 10) + 1)];
        onChange(newOccupancy, element);
    };

    // const renderErrors = () => {
    //     const errorOutput = [];
    //     if (errors !== undefined && errors !== null && Object.keys(errors).length > 0) {
    //         Object.keys(errors).forEach((key) => {
    //             const parts = key.split('-');
    //             // do not output required errors - they go in the engine beside the field
    //             if (parts[1] === 'childAge') {
    //                 errorOutput.push((
    //                     <div key={`${parts[0]}-${parts[2]}`} className="error-message">
    //                         <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
    //                             <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
    //                         </svg>
    //                         {errors[key].message}
    //                     </div>
    //                 ));
    //             }
    //         });
    //     }
    //     return errorOutput;
    // };

    const renderPopoverContent = () => {
        let renderOccupancy = [{ adults: 0, children: 0, ages: [] }];
        if (hasRooms || occupancy.length === 1) {
            renderOccupancy = occupancy;
        } else {
            occupancy.forEach((room) => {
                renderOccupancy[0].adults += room.adults;
                renderOccupancy[0].children += room.children;
                renderOccupancy[0].ages.push(...room.ages);
            });
        }

        return renderOccupancy.map((room, index) => {
            let occupancySelectors = '';
            const roomErrors = errors[`${index}-room`];
            const roomErrorKeys = Object.keys(roomErrors || {});
            occupancySelectors = (
                <div className="">
                    { (selectedProducts == 'FH' && errors['passengersMax']) ?
                        <div className="error-container w-100 mb-2">
                            <ErrorText error={errors.passengersMax.maximumPassengers} />
                        </div> : null
                    }
                    
                    {hasRooms && (
                        <div className="room-title">Room {index + 1}</div>
                    )}
                    {roomErrorKeys.length > 0 && (
                        <div className="error-container w-100 mb-2">
                            {roomErrorKeys.map((key) => (<ErrorText error={roomErrors[key]} />))}
                        </div>
                    )}
                    
                    <div className="row gutter-10">
                        <div className="col-6">
                            <label htmlFor={`${index}-adults`}>{Lang.trans('engine.adults')}</label>
                            <div className="element-container input-chevron-down chevron-sm">
                                <select
                                    id={`${index}-adults`}
                                    onChange={(event) => changeOccupancy(event, `${index}-adults`)}
                                    value={room.adults.toString()}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-6">
                            <label htmlFor={`${index}-children`}>{Lang.trans('engine.children')}</label>
                            <div className="element-container input-chevron-down chevron-sm">
                                <select
                                    id={`${index}-children`}
                                    onChange={(event) => changeOccupancy(event, `${index}-children`)}
                                    value={room.children.toString()}
                                >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            );
            let childSelectors = '';

            if (room.children > 0) {
                childSelectors = (
                    <div className="child-age">
                        <span>{Lang.trans('engine.child_age_upon_return')}</span>
                        <div className="row gutter-10">
                            {room.ages.map((child, i) => (
                                <div key={i} className="col-6">
                                    <label className="label-secondary" htmlFor={`${index}-childAge-${i}`}>child</label>
                                    <div className="element-container input-chevron-down chevron-sm">
                                        <select
                                            id={`${index}-childAge-${i}`}
                                            onBlur={() => { validateField(`${index}-childAge-${i}`); }}
                                            value={child.toString()}
                                            onChange={(event) => changeOccupancy(event, `${index}-childAge-${i}`)}
                                        >
                                            <option value="">--</option>
                                            <option value="0">&lt;1</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            return (
                <div key={`hotelOccupancyPopover-${index}`} className="custom-form-element">
                    {occupancySelectors}
                    {childSelectors}
                </div>
            );
        });
    };

    const guests = countGuests(occupancy);
    return (
        <div className="element-container hotel-popover htl_popover input-chevron-down chevron-sm">
            <button id="fltguests" type="button" className="btn btn-guest" onClick={clickGuest}>{guests}</button>
            <div className={`popover guests-popover ${visible ? '' : 'hidden'}`}>
                <button type="button" className="popover-close" onClick={clickGuest} />
                {renderPopoverContent()}
            </div>
        </div>
    );
};

HotelOccupancy.propTypes = {
    occupancy: PropTypes.instanceOf(Array).isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.instanceOf(Object).isRequired,
    visible: PropTypes.bool.isRequired,
    validateField: PropTypes.func.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    hasRooms: PropTypes.bool,
    selectedProducts: PropTypes.func.isRequired,
};

HotelOccupancy.defaultProps = {
    hasRooms: true,
    selectedProducts: () => {},
};

export default HotelOccupancy;
