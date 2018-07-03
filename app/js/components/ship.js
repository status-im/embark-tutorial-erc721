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
        // TODO: cuando se carga el componente se deben buscar los atributos del token
        this._loadAttributes();
    }

    _loadAttributes(){
        // TODO: implementar carga de atributos aca
        // El unico atributo interesante es la imagen
        // Guardar el url en this.state.image
        
        // Ejemplo
        this.setState({image: "./images/sampleShip.png"});
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
        // TODO: comprar token recien creado
        // En props esta el atributo 'id' y 'price', que podemos usar para determinar el id del token

        this.setState({isSubmitting: true});
        // Llamar la siguiente funcion para refrescar las listas
        this.props.onAction();
        this.setState({isSubmitting: false});
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
        
        const formattedPrice = !wallet ? price : '';

        return <div className="ship">
            { !wallet ? <span className="price">{formattedPrice} Ξ</span> : ''}
            <img src={image} />
            <br />
            <ul>
                <li title="Energia"><i className="fa fa-dashboard" aria-hidden="true"></i> {energy}</li>
                <li title="Lasers"><i className="fa fa-crosshairs" aria-hidden="true"></i> {lasers}</li>
                <li title="Escudo"><i className="fa fa-shield" aria-hidden="true"></i> {shield}</li>
            </ul>
            { !wallet || marketplace
                ? <Button disabled={isSubmitting} bsStyle="success" onClick={marketplace ? this.buyFromMarket : this.buyFromStore}>Comprar</Button> 
                : (!showSellForm && salesEnabled
                    ? <Button bsStyle="success" className="hiddenOnLeave" onClick={e => { this.showSellForm(true) }}>Vender</Button>
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
                    <Button disabled={isSubmitting} bsStyle="success" onClick={this.sellShip}>Vender</Button>
                    <Button disabled={isSubmitting} onClick={e => { this.showSellForm(false) }}>Cancelar</Button>
                </Fragment> : ''
            }

             { isSubmitting ? <Spinner name="ball-pulse-sync" color="green"/> : '' }
            </div>;
    }
}

export default Ship;
