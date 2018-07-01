import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3"
import { Button } from 'react-bootstrap';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
window.SpaceshipToken = SpaceshipToken;
class Ship extends Component {

    constructor(props){
        super(props);
        this.state = {
            image: ''
        }
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

    handleClick = () => {
        const { buySpaceship } = SpaceshipToken.methods;
        const toSend = buySpaceship(this.props.id)
        toSend.estimateGas({value: this.props.price })
            .then(estimatedGas => {
                return toSend.send({from: web3.eth.defaultAccount,
                                    value: this.props.price,
                                    gas: estimatedGas + 1000000});
            })
            .then(receipt => {
                console.log(receipt);
                // TODO: show success
                // TODO: hide ship
            })
            .catch((err) => {
                console.error(err);
                // TODO: show error blockchain
                
            });
    }

    render(){
        const { energy, lasers, shield, price, wallet } = this.props;
        const { image } = this.state;
        
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
                ? <Button bsStyle="success" onClick={this.handleClick}>Comprar</Button> 
                : <Button bsStyle="success" onClick={this.handleClick}>Vender</Button>
             }
            </div>;
    }
}


export default Ship;