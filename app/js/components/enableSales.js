import EmbarkJS from 'Embark/EmbarkJS';
import React from 'react';
import Toggle from 'react-toggle'

const EnableSales = (props) => {
    const {salesEnabled, handleChange, isSubmitting } = props;

    return <label id="enableSales">
            <Toggle
                checked={salesEnabled === true ? true : false }
                onChange={handleChange}
                disabled={isSubmitting}
                />
            <span>Habilitar ventas</span>
        </label>
}


export default EnableSales;
  