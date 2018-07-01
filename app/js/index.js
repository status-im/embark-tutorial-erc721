import EmbarkJS from 'Embark/EmbarkJS';
import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import ShipList from './components/shipList.js';
import WithdrawBalance from './components/withdrawBalance.js';
import AddToken from './components/addToken.js';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOwner: false,
            hidePanel: false,
            shipsForSale: [],
            myShips: []
        }
    }

    componentDidMount(){
        EmbarkJS.onReady((err) => {
            this._isOwner();
            this._loadEverything();
        });
    }

    _loadEverything(){
        this._loadShipsForSale();
        this._loadMyShips();
    }

    _isOwner(){
        SpaceshipToken.methods.owner()
            .call()
            .then(owner => {
                this.setState({isOwner: owner == web3.eth.defaultAccount});
                return true;
            });
    }

    _loadShipsForSale = async () => {
        const { shipsForSaleN, shipsForSale, spaceshipPrices, spaceships } = SpaceshipToken.methods;
    
        const total = await shipsForSaleN().call();
        const list = [];
        if(total){
          for (let i = total-1; i >= 0; i--) {
            const shipId = await shipsForSale(i).call();
            const _info = await spaceships(shipId).call();
            const _price = await spaceshipPrices(shipId).call();
    
            const ship = {
              price: _price,
              id: shipId,
              ..._info
            };
            list.push(ship);
          }
        }
        this.setState({shipsForSale: list.reverse()});
    }

    _loadMyShips = async () => {
        const { balanceOf, tokenOfOwnerByIndex, spaceships } = SpaceshipToken.methods;
    
        const total = await balanceOf(web3.eth.defaultAccount).call();
        const list = [];
        if(total){
          for (let i = total-1; i >= 0; i--) {
            const myShipId = await tokenOfOwnerByIndex(web3.eth.defaultAccount, i).call();
            const _info = await spaceships(myShipId).call();
    
            const ship = {
              id: myShipId,
              ..._info
            };
            list.push(ship);
          }
        }
        this.setState({myShips: list.reverse()});
      }

    render(){
        const { isOwner, hidePanel, shipsForSale, myShips } = this.state;

        return (
        <Fragment>
            { isOwner && !hidePanel ? 
                <div id="management">
                    <span className="close" onClick={ (e) => this.setState({'hidePanel': true})}>cerrar</span>
                    <WithdrawBalance />
                    <AddToken loadShipsForSale={this._loadShipsForSale} />
                </div> : '' 
            }
            <ShipList title="Mis Naves" id="myShips" list={myShips} onAction={(e) => this._loadEverything()} wallet={true}  />
            <ShipList title="Tienda" id="shipyard" list={shipsForSale} onAction={(e) => this._loadEverything()} />
        </Fragment>);
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
