import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3"
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import Ship from './ship';

class ShipList extends Component {

  render = () => {
    const { list, title, id, wallet, onBuy } = this.props;
    return <div id={id}>
      <h3>{title}</h3>
      { list.map((ship, i) => <Ship onBuy={onBuy} wallet={wallet} key={i} {...ship} />) }
     </div>;
  }
}


export default ShipList;
