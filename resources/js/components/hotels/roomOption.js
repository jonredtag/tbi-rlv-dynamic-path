import React from 'react';
import PropTypes from 'prop-types';
import HsbcPoints from 'components/snippets/HsbcPoints';
import CibcPoints from 'components/snippets/CibcPoints';

import ShowUpLift from 'components/common/ShowUpLift';
import Lang, { priceFormat } from 'libraries/common/Lang';
import UncontrolledPopover from 'reactstrap/lib/UncontrolledPopover';
import PopoverBody from 'reactstrap/lib/PopoverBody';

import RoomOptionDetails from 'components/hotels/RoomOptionDetails';

const RoomOption = (props) => {
    const { room, isStandalone, numberOfPax, onSelect, showTotal, isFilterStatus } = props;

    return (
        <>
            {(() => {
                if (isFilterStatus==1 && room.cancellation==true) {
                    return (
                        <RoomOptionDetails room={room} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} isFilterStatus={isFilterStatus} />
                    )
                }

                if (isFilterStatus==0 && room.cancellation==false) {
                    return (
                        <RoomOptionDetails room={room} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} isFilterStatus={isFilterStatus} />
                    )
                }

                if ( isFilterStatus==2 && ( (room.cancellation==true) || (room.cancellation==false) )) {
                    return (
                        <RoomOptionDetails room={room} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} isFilterStatus={isFilterStatus} />
                    )
                }

            })()}
        </>
    );
};

RoomOption.propTypes = {
    room: PropTypes.instanceOf(Object).isRequired,
    isStandalone: PropTypes.bool.isRequired,
    numberOfPax: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    showTotal: PropTypes.bool,
};

RoomOption.defaultProps = {
    showTotal: false,
    isFilterStatus: 2,
};

export default RoomOption;
