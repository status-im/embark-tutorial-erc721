import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3"
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';
import Spinner from 'react-spinkit';


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
        EmbarkJS.onReady((err) => {
          this._loadAttributes();
        });
    }

    _loadAttributes(){
        EmbarkJS.Storage.get(web3.utils.toAscii(this.props.metadataHash))
            .then(content => {
                const jsonMetadata = JSON.parse(content);
                let _url = EmbarkJS.Storage.getUrl(jsonMetadata.imageHash);
                this.setState({image: _url})
            });
    }

    showSellForm = (show) => {
        this.setState({'showSellForm': show});
    }

    sellShip = () => {
        this.setState({isSubmitting: true});
        this.props.onAction();
    }

    buyShip = () => {
        const { buySpaceship } = SpaceshipToken.methods;
        const toSend = buySpaceship(this.props.id)

        this.setState({isSubmitting: true});

        toSend.estimateGas({value: this.props.price })
            .then(estimatedGas => {
                return toSend.send({from: web3.eth.defaultAccount,
                                    value: this.props.price,
                                    gas: estimatedGas + 1000000});
            })
            .then(receipt => {
                console.log(receipt);

                this.props.onAction();

                // TODO: show success
                return true;
            })
            .catch((err) => {
                console.error(err);
                // TODO: show error blockchain
            })
            .finally(() => {
                this.setState({isSubmitting: false});
            });
    }

    render(){
        const { energy, lasers, shield, price, wallet } = this.props;
        const { image, isSubmitting, showSellForm } = this.state;
        
        const formattedPrice = !wallet ? web3.utils.fromWei(price, "ether") : '';

        return <div className="ship">
            { !wallet ? <span className="price">{formattedPrice} Ξ</span> : ''}
            <img src={image} />
            <br />
            <ul>
                <li>Energia: {energy}</li>
                <li>Lasers: {lasers}</li>
                <li>Escudo: {shield}</li>
            </ul>
            { !wallet 
                ? <Button disabled={isSubmitting} bsStyle="success" onClick={this.buyShip}>Comprar</Button> 
                : (!showSellForm 
                    ? <Button bsStyle="success" onClick={e => { this.showSellForm(true) }}>Vender</Button>
                    : '')
             }

            { showSellForm
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
