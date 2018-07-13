import React from 'react';
import Toggle from 'react-toggle'

const EnableSales = (props) => {
    const {salesEnabled, handleChange, isSubmitting } = props;

    return <label id="enableSales">
            <Toggle
                checked={salesEnabled }
                onChange={handleChange}
                disabled={isSubmitting}
                />
            <span>Enable sales</span>
        </label>
}


export default EnableSales;
  