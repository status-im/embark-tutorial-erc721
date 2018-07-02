import EmbarkJS from 'Embark/EmbarkJS';
import React, { Fragment, Component } from 'react';
import Toggle from 'react-toggle'
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';


class MarketPlace extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
          isSubmitting: true
      }
    }

    componentDidMount(){
        
    }

    
    
    render(){
      return <div id="marketplace">
            <h3>Mercado</h3>
            
        </div>;
    }
  }
  
  export default MarketPlace;
  