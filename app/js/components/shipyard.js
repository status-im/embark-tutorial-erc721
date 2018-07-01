import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3"
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import Ship from './ship';

class Shipyard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shipList: []
    }
  }

  componentDidMount(){
    EmbarkJS.onReady((err) => {
      this._loadShipsForSale();
    });
  }

  _loadShipsForSale = async () => {
    const { shipsForSaleN, shipsForSale, spaceshipPrices, spaceships } = SpaceshipToken.methods;

    const total = await shipsForSaleN().call();
    const list = [];
    if(total){
      for (let i = total-1; i >= 0; i--) {
        const shipForSale = await shipsForSale(i).call();
        const _info = await spaceships(shipForSale).call();
        const _price = await spaceshipPrices(shipForSale).call();

        const ship = {
          price: _price,
          id: shipForSale,
          ..._info
        };
        list.push(ship);
      }
    }
    this.setState({shipList: list.reverse()});
  }

  render = () => {
    const { shipList } = this.state;
    return <div id="shipyard">
      <h3>Tienda</h3>
      { shipList.map((ship, i) => <Ship  wallet={false} key={i} {...ship} />) }
     </div>;
  }
}


export default Shipyard;
