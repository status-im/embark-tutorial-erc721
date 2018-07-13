import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import ShipList from './components/shipList.js';
import WithdrawBalance from './components/withdrawBalance.js';
import AddToken from './components/addToken.js';
import MarketPlace from './components/marketplace.js';
import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3";
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOwner: false,
            hidePanel: false,
            shipsForSale: [],
            myShips: [],
            marketPlaceShips: []
        }
    }

    componentDidMount(){
        EmbarkJS.onReady((err) => {
            this._isOwner();
            this._loadEverything();
        });
    }

    _loadEverything(){
        this._loadShipsForSale(); // New tokens sales
        this._loadMyShips(); // My Wallet
        this._loadMarketPlace(); // Token marketplace
    }

    _isOwner(){
        SpaceshipToken.methods.owner()
            .call()
            .then(owner => {
                this.setState({isOwner: owner == web3.eth.defaultAccount});
                return true;
            });
    }

    _loadMyShips = async () => {
        const { balanceOf, tokenOfOwnerByIndex, spaceships } = SpaceshipToken.methods;
        
        const list = [];
    
        const total = await balanceOf(web3.eth.defaultAccount).call();
        if(total){
            for (let i = total-1; i >= 0; i--) {
                const id = await tokenOfOwnerByIndex(web3.eth.defaultAccount, i).call();
                const info = await spaceships(id).call();
        
                const ship = {
                  id,
                  ...info
                };
                list.push(ship);
            }
        }
        this.setState({myShips: list.reverse()});
    }

    _loadShipsForSale = async () => {
        const { shipsForSaleN, shipsForSale, spaceshipPrices, spaceships } = SpaceshipToken.methods;
    
        const list = [];
    
        const total = await shipsForSaleN().call();
        if(total){
            for (let i = 0; i < total; i++) {
                const id = await shipsForSale(i).call();
                const info = await spaceships(id).call();
                const price = await spaceshipPrices(id).call();
    
                const ship = {
                    id,
                    price,       
                    ...info
                };
                list.push(ship);
            }
        }
        this.setState({shipsForSale: list.reverse()});
    }

    _loadMarketPlace = async () => {
        const { nSale, sales } = SpaceshipMarketplace.methods;
        const { spaceships } = SpaceshipToken.methods;
    
        const list = [];
    
        const total = await nSale().call();
        if(total){
            for (let i = total-1; i >= 0; i--) {
                const sale = await sales(i).call();
                const info = await spaceships(sale.spaceshipId).call();
                const ship = {
                    owner: sale.owner,
                    price: sale.price,
                    id: sale.spaceshipId,
                    saleId: i,
                    ...info
                };
                list.push(ship);
            }
        }
        this.setState({marketPlaceShips: list.reverse()});
    }

    render(){
        const { isOwner, hidePanel, shipsForSale, myShips, marketPlaceShips } = this.state;

        return (
        typeof(web3) === "undefined" && typeof(EmbarkJS) !== "undefined" 
        ? <Fragment>
            <h3>No web3 provider was detected</h3>
            <p>The easiest way to interact with this DApp is using Status:</p>
            <ul>
                <li>IOS: Sign up <a href="https://status.im/success.html">here</a></li>
                <li>Android: Download from the <a href="https://hs-3954379.t.hubspotemail.net/e1t/c/*W41DrrR576YXwW1g0twY4l6xHW0/*W4W80L47W9sgzW29n3jf3B0spz0/5/f18dQhb0S4007rmtHfV12fxx5VRhLcN56MR7dhW2vYW6FzPhr8bLg8BW7wfwHD77xh4BVC-SLw8K_1QSW5GxQvR1sQJ5jVD9fTd4nXXdvMNQbcPgVDM_N33FZt2S-Y7DW91QKkb4RkrPPW493NBn8KgjlJN88JFdQ4DH0cW9cs3zS6VKqGRW7G0nyJ3z8s2PW3pb3q040w1lQW4p0nGT2FfY9KMrYVt8rT2YCW3GL73b2Fj2j4N56RMzHfcp_hW7fW6gW4dBzfRW3tZgJb6wB1JfVd0zbv35wh4RN8zbXKpnyfj6W6yM6K41NZprfN1PZNlPgv7zFW71lRcW8yGypBMnGzt-xFbw9N8TJbMTVfCwcW1YQHxz1GQtXKW657lCJ5fhKvjW1_8CNL4BTT7wW69P8Y64hksdCW80wSFy4CkbFPW1pPcF65bpn_JW7WZ7l285LvsQVWNwb38cgFp2W2DF0P046C5dqN7L0FQ2SrfSCW3yggzM7T60VNW6-9ws44Nq68yW5ghc8S3jzRf5W7NDz4_49hbllW1CCcl63gd1KmW2n5V8p5slbFjW7PgZ_T5vd89hMxFPvDlGMxDW3VqJG78dKTzXN46s6SqMbrmyW5L36lt6n-7WNW141ZBT444dDhW5t6Y8f8Z1MLWV4pX33282QyrW1j06VK7zr2Q6W7bcdfr591ZtSW43_Xkw4lPzBFW4h7jHc97dFs7W88ZFRD1GXrZpW9jWR8G6Xg9lQN3GBfHngxjrGf39tZ-n03">PlayStore</a></li>
            </ul>
            <p>You can also use <a href="https://metamask.io/">Metamask</a></p>
        </Fragment>
        :
        <Fragment>
            { isOwner && !hidePanel ? 
                <div id="management">
                    <span className="close" onClick={ (e) => this.setState({'hidePanel': true})}>close</span>
                    <WithdrawBalance />
                    <AddToken loadShipsForSale={this._loadShipsForSale} />
                </div> : '' 
            }
            <ShipList title="My Wallet" id="myShips" list={myShips} onAction={(e) => this._loadEverything()} wallet={true}  />
            <MarketPlace list={marketPlaceShips} onAction={(e) => this._loadEverything()} />
            <ShipList title="Store" id="shipyard" list={shipsForSale} onAction={(e) => this._loadEverything()} />
        </Fragment>);
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
