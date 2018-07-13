import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import ShipList from './components/shipList.js';
import WithdrawBalance from './components/withdrawBalance.js';
import AddToken from './components/addToken.js';
import MarketPlace from './components/marketplace.js';

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
        // ============== BEGIN: Function implementation here ================ //

        // Determine if we are the owners of the contract
        this._isOwner();
        // Load spaceships in different sections
        this._loadEverything();

        // ============== END: Function implementation here   ================ //
    }

    _loadEverything(){
        this._loadShipsForSale(); // New tokens sales
        this._loadMyShips(); // My Wallet
        this._loadMarketPlace(); // Token marketplace
    }

    _isOwner(){
        // ============== BEGIN: Function implementation here ================ //    
        // TODO: determine if we are the owners of the contract
        this.setState({isOwner: true}); 
                // ============== BEGIN: Function implementation here ================ //
        // ============== END: Function implementation here   ================ //
    }

    _loadMyShips = async () => {
        // ============== BEGIN: Function implementation here ================ //    

        // TODO: We want to load the lists of ships a user has
        // this.state.myShips expects an array of objects with these attributes:
        // {
        //   id: "token Id",
        //   energy: "token attribute",
        //   lasers: "token attribute",
        //   shield: "token attribute",
        //   metadataHash: "token attribute",
        // }
        
        // Example: 
        const myShip = {
            id: 1,
            energy: 10,
            lasers: 5,
            shield: 7,
            metadataHash: "METADATA"
        };
        const list = [ myShip ];
        this.setState({myShips: list});

        // ============== END: Function implementation here   ================ //    
    }

    _loadShipsForSale = async () => {
        // ============== BEGIN: Function implementation here ================ //    

        // TODO: load the list of ships for sale 
        // this.state.shipsForSale expects an array of objects with these attributes:
        // {
        //   id: "token Id",
        //   energy: "token attribute",
        //   lasers: "token attribute",
        //   shield: "token attribute",
        //   metadataHash: "token attribute",
        //   price: "token price"
        // }

        let list = [];
        this.setState({shipsForSale: list});
    }

    _loadMarketPlace = async () => {
        // TODO: debemos cargar la lista de naves que estan a la venta en el marketplace
        // se espera un array de objetos en el estado marketPlaceShips
        // cada objeto debe tener los siguientes atributos:
        // {
        //   owner: "dueno de la nave en venta",
        //   price: "precio de venta",
        //   id: "id del token",
        //   saleId: "id de la venta",
        //   energy: "Atributo del token",
        //   lasers: "Atributo del token",
        //   shield: "Atributo del token",
        //   metadataHash: "Atributo del token",
        // }
        
        let list = [];
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
