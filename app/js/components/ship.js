import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import Spinner from 'react-spinkit';
import MarketPlace from './marketplace';


class Ship extends Component {

    constructor(props){
        super(props);
        this.state = {
            image: '',
            isSubmitting: false,
            showSellForm: false,
            sellPrice: ''
        }
    }
    
    handleChange(fieldName, value) {
        this.state[fieldName] = value;
        this.setState(this.state);
    }

    componentDidMount(){
        // ============== BEGIN: Function implementation here ================ //
        this._loadAttributes();
        // ============== END: Function implementation here   ================ //
    }

    _loadAttributes(){
        // ============== BEGIN: Function implementation here ================ //
        // TODO: the only attribute we are interested to load is the image
        this.setState({image: "./images/sampleShip.png"});
        // ============== END: Function implementation here   ================ //
    }

    showSellForm = (show) => {
        this.setState({'showSellForm': show});
    }

    sellShip = () => {
        // TODO: vender una nave para que otro usuario la pueda comprar
        // En props esta el atributo 'id', que podemos usar para determinar el id del token
        // El precio esta en el estado this.state.sellPrice
        
        this.setState({isSubmitting: true});
        // Llamar la siguiente funcion para refrescar las listas
        this.props.onAction();
        this.setState({isSubmitting: false});
    }

    buyFromStore = () => {
        // ============== BEGIN: Function implementation here ================ //
        // In props you can find the attributes 'id' and 'price' required for buying the token
        this.setState({isSubmitting: true});
        this.props.onAction(); // This function needs to be called to reload the lists of spaceships
        this.setState({isSubmitting: false});
        // ============== END: Function implementation here   ================ //

    }

    buyFromMarket = () => {
        // TODO: comprar tokens puestos a la venta por otra persona
        // En props esta el 'saleId' y 'price' para poder comprarlo
        
        this.setState({isSubmitting: true});
        // Llamar la siguiente funcion para refrescar las listas
        this.props.onAction();
        this.setState({isSubmitting: false});
    }

    render(){
        const { energy, lasers, shield, price, wallet, salesEnabled, marketplace } = this.props;
        const { image, isSubmitting, showSellForm } = this.state;
        
        // ============== BEGIN: Format price here ================ //

        const formattedPrice = !wallet ? price : '';

        // ============== END: Format price here   ================ //

        return <div className="ship">
            { !wallet ? <span className="price">{formattedPrice} Ξ</span> : ''}
            <img src={image} />
            <br />
            <ul>
                <li title="Energy"><i className="fa fa-dashboard" aria-hidden="true"></i> {energy}</li>
                <li title="Lasers"><i className="fa fa-crosshairs" aria-hidden="true"></i> {lasers}</li>
                <li title="Shield"><i className="fa fa-shield" aria-hidden="true"></i> {shield}</li>
            </ul>
            { !wallet || marketplace
                ? <Button disabled={isSubmitting} bsStyle="success" onClick={marketplace ? this.buyFromMarket : this.buyFromStore}>Buy</Button> 
                : (!showSellForm && salesEnabled
                    ? <Button bsStyle="success" className="hiddenOnLeave" onClick={e => { this.showSellForm(true) }}>Sell</Button>
                    : '')
             }

            { showSellForm && salesEnabled
                ? <Fragment>
                    <InputGroup>
                        <FormControl
                            type="text"
                            value={this.state.sellPrice}
                            onChange={(e) => this.handleChange('sellPrice', e.target.value)} />
                            <InputGroup.Addon>Ξ</InputGroup.Addon>
                    </InputGroup>
                    <Button disabled={isSubmitting} bsStyle="success" onClick={this.sellShip}>Sell</Button>
                    <Button disabled={isSubmitting} onClick={e => { this.showSellForm(false) }}>Cancel</Button>
                </Fragment> : ''
            }

             { isSubmitting ? <Spinner name="ball-pulse-sync" color="green"/> : '' }
            </div>;
    }
}

export default Ship;
