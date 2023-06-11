import React, { memo, useRef, useState } from 'react';
import '../../assets/styles/scss/_common_component.scss';
// Helpers
import {
    toggleClass
} from '../../utils/helpers/ToggleClass';

const ButtonDropdown = ({placeHolder, icon, selectVal, callbackKey, callback, defaultValue}) => {
    const [selectedVal, setSelectedVal] = useState(defaultValue ? defaultValue : '');
    const wrapper = useRef(null);

    const renderOptions = (options) => {
        return (
            options.map((op, i) => {
                return (
                    <button type='button' key={placeHolder + i} onClick={() => {
                        setSelectedVal(op);
                        toggleClass(wrapper.current, 'active')
                        callback(callbackKey, op);
                    }}
                    >
                        {op}
                    </button>
                )
            })
        )
    }

    return (
        <div 
            className="common-component__button-dropdown" 
            type='button' 
            onClick={e => toggleClass(e.target, 'active')}
            ref={wrapper}
        >
            <p style={icon && {justifyContent:'space-between'}}>
                {selectedVal.length ? selectedVal : placeHolder}
                {icon ? <i className={icon}></i> : <></>}
            </p>
            <div className='cc-button-dropdown__content'>
                {renderOptions(selectVal)}
            </div>
        </div>
    );
}

export default memo(ButtonDropdown);
