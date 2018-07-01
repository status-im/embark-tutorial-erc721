import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3"
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import Ship from './ship';

class MyShips extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shipList: []
    }
  }

  componentDidMount(){
    EmbarkJS.onReady((err) => {
      this._loadShips();
    });
  }

  _loadShips = async () => {
    const { balanceOf, tokenOfOwnerByIndex, spaceships } = SpaceshipToken.methods;

    const total = await balanceOf(web3.eth.defaultAccount).call();
    const list = [];
    if(total){
      for (let i = total-1; i >= 0; i--) {
        const shipForSale = await tokenOfOwnerByIndex(web3.eth.defaultAccount, i).call();
        const _info = await spaceships(shipForSale).call();

        const ship = {
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
    return <div id="myShips">
      <h3>Mis Naves</h3>
      <div>
      { shipList.map((ship, i) => <Ship wallet={true} key={i} {...ship} />) }
     </div>
    </div>;
  }
}


export default MyShips;
