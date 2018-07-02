import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from 'Embark/EmbarkJS';
import Ship from './ship';
import EnableSales from './enableSales';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';

class ShipList extends Component {

  constructor(props){
    super(props);
    this.state = {
      isSubmitting: false,
      salesEnabled: false
    }
  }

  componentDidMount(){
    EmbarkJS.onReady((err) => {
        // Al cargar la lista de naves, determinamos si estan aprobadas para la venta
        const { isApprovedForAll } = SpaceshipToken.methods;
        isApprovedForAll(web3.eth.defaultAccount, SpaceshipMarketplace.options.address)
            .call()
            .then(isApproved => {
                this.setState({salesEnabled: isApproved});
            });
    });
  }

  enableMarketplace = () => {
    const { setApprovalForAll } = SpaceshipToken.methods;

    this.setState({isSubmitting: true});

    const toSend = setApprovalForAll(SpaceshipMarketplace.options.address, !this.state.salesEnabled);

    toSend.estimateGas()
        .then(estimatedGas => {
            return toSend.send({from: web3.eth.defaultAccount,
                                gas: estimatedGas + 1000});
        })
        .then(receipt => {
            this.setState({salesEnabled: !this.state.salesEnabled});
            console.log(receipt);
        })
        .catch((err) => {
            console.error(err);
            // TODO: show error blockchain
            
        })
        .finally(() => {
          this.setState({isSubmitting: false});
        });
  }

  render = () => {
    const { list, title, id, wallet, onAction, marketplace } = this.props;
    const { salesEnabled } = this.state;

    return <div id={id}>
      <h3>{title}</h3> 
      { wallet ? <EnableSales isSubmitting={this.state.isSubmitting} handleChange={this.enableMarketplace} salesEnabled={this.state.salesEnabled} /> : ''}
      { list.map((ship, i) => <Ship onAction={onAction} wallet={wallet} salesEnabled={salesEnabled} key={i} marketplace={marketplace} {...ship} />) }
      { list.length == 0 
        ? <p>No hay naves disponibles</p> 
        : ''
      }
      </div>;
  }

} 


export default ShipList;