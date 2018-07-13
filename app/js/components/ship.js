import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import Spinner from 'react-spinkit';
import MarketPlace from './marketplace';
import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3";
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';

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
        const metadataHash = web3.utils.toAscii(this.props.metadataHash);
        EmbarkJS.Storage.get(metadataHash)
        .then(content => {
            const jsonMetadata = JSON.parse(content);
            this.setState({image: jsonMetadata.image});
        });
    }

    showSellForm = (show) => {
        this.setState({'showSellForm': show});
    }

    sellShip = () => {
        const { forSale } = SpaceshipMarketplace.methods;
        const { sellPrice } = this.state;
        const { id } = this.props;
    
        this.setState({isSubmitting: true});
    
        const toSend = forSale(id, web3.utils.toWei(sellPrice, 'ether'))
    
        toSend.estimateGas()
        .then(estimatedGas => {
            return toSend.send({gas: estimatedGas + 1000});
        })
        .then(receipt => {
            console.log(receipt);
            this.props.onAction(); // Update ship lists
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            this.setState({isSubmitting: false});
        });
    }

    buyFromStore = () => {
        this.setState({isSubmitting: true});
    
        const { buySpaceship } = SpaceshipToken.methods;
    
        const toSend = buySpaceship(this.props.id)
    
        toSend.estimateGas({value: this.props.price })
        .then(estimatedGas => {
            return toSend.send({value: this.props.price,
                                gas: estimatedGas + 1000000});
        })
        .then(receipt => {
            console.log(receipt);
            this.props.onAction();
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            this.setState({isSubmitting: false});
        });
    }

    buyFromMarket = () => {
        this.setState({isSubmitting: true});
    
        const { buy } = SpaceshipMarketplace.methods;
        const toSend = buy(this.props.saleId);
    
        toSend.estimateGas({value: this.props.price })
        .then(estimatedGas => {
            return toSend.send({value: this.props.price,
                                gas: estimatedGas + 1000000});
        })
        .then(receipt => {
            console.log(receipt);
            this.props.onAction(); // Call this to reload spaceship lists
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            this.setState({isSubmitting: false});
        });
    }

    render(){
        const { energy, lasers, shield, price, wallet, salesEnabled, marketplace } = this.props;
        const { image, isSubmitting, showSellForm } = this.state;
        
        const formattedPrice = !wallet ? web3.utils.fromWei(price, "ether") : '';

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
