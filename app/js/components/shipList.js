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
    // TODO: nos interesa saber si las ventas estan habilidatas o no para los tokens
    // El estado que maneja esto es 'salesEnabled'. 
    // Aqui lo seteamos en true, solo para ver que funcione, pero debe venir del contrato
    this.setState({salesEnabled: false});
  }

  enableMarketplace = () => {
    // ============== BEGIN: Function implementation here ================ //
    // TODO: this function is called when we click on the toggle.
    // Must set the state this.state.salesEnabled
    this.setState({isSubmitting: true});
    this.setState({salesEnabled: !this.state.salesEnabled});
    this.setState({isSubmitting: false});
    // ============== END: Function implementation here   ================ //
  }

  render = () => {
    const { list, title, id, wallet, onAction, marketplace } = this.props;
    const { salesEnabled } = this.state;

    return <div id={id}>
      <h3>{title}</h3> 
      { wallet ? <EnableSales isSubmitting={this.state.isSubmitting} handleChange={this.enableMarketplace} salesEnabled={this.state.salesEnabled} /> : ''}
      { list.map((ship, i) => <Ship onAction={onAction} wallet={wallet} salesEnabled={salesEnabled} key={i} marketplace={marketplace} {...ship} />) }
      { list.length == 0 
        ? <p>No ships available</p> 
        : ''
      }
      </div>;
  }

} 


export default ShipList;