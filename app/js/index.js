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
        // TODO: Debemos determinar si la cuenta que estamos usando es la del dueno del token
        // y cargar tambien las naves
        this._isOwner();
        this._loadEverything();
    }

    _loadEverything(){
        // Cargamos todas las naves que estan a la venta, que estan en mi wallet y en el mercado
        this._loadShipsForSale();
        this._loadMyShips();
        this._loadMarketPlace();
    }

    _isOwner(){
        // TODO: Nos interesa saber si somos el dueno del contrato para mostrar el formulario de tokens
        // Debemos actualizar el estado isOwner con la informacion del contrato
        this.setState({isOwner: true}); 
    }

    _loadMyShips = async () => {
        // TODO: aqui nos interesa cargar la lista de naves que posee el usuario
        // se espera un array de objetos en el estado myShips
        // cada objeto debe tener los siguientes atributos:
        // {
        //   id: "id del token",
        //   energy: "Atributo del token",
        //   lasers: "Atributo del token",
        //   shield: "Atributo del token",
        //   metadataHash: "Atributo del token",
        // }
        
        // Ejemplo: 
        const myShip = {
            id: 1,
            energy: 10,
            lasers: 5,
            shield: 7,
            metadataHash: "METADATA"
        };
        const list = [ myShip ];
        this.setState({myShips: list.reverse()});
    }

    _loadShipsForSale = async () => {
        // TODO: aqui nos interesa cargar la lista de naves a la venta cuando generamos el token
        // se espera un array de objetos en el estado shipsForSale
        // cada objeto debe tener los siguientes atributos:
        // {
        //   price: "precio de venta",
        //   id: "id del token",
        //   energy: "Atributo del token",
        //   lasers: "Atributo del token",
        //   shield: "Atributo del token",
        //   metadataHash: "Atributo del token",
        // }

        const list = [];
        this.setState({shipsForSale: list.reverse()});
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

        const list = [];
        this.setState({marketPlaceShips: list.reverse()});
    }

    render(){
        const { isOwner, hidePanel, shipsForSale, myShips, marketPlaceShips } = this.state;

        return (
        typeof(web3) === "undefined" && typeof(EmbarkJS) !== "undefined" 
        ? <Fragment>
            <h3>No se detectó ningun proveedor de web3</h3>
            <p>La forma mas simple de interactuar con esta DApp es a traves de Status:</p>
            <ul>
                <li>IOS: Registrate <a href="https://status.im/success.html">aqui</a></li>
                <li>Android: Descargalo desde el <a href="https://hs-3954379.t.hubspotemail.net/e1t/c/*W41DrrR576YXwW1g0twY4l6xHW0/*W4W80L47W9sgzW29n3jf3B0spz0/5/f18dQhb0S4007rmtHfV12fxx5VRhLcN56MR7dhW2vYW6FzPhr8bLg8BW7wfwHD77xh4BVC-SLw8K_1QSW5GxQvR1sQJ5jVD9fTd4nXXdvMNQbcPgVDM_N33FZt2S-Y7DW91QKkb4RkrPPW493NBn8KgjlJN88JFdQ4DH0cW9cs3zS6VKqGRW7G0nyJ3z8s2PW3pb3q040w1lQW4p0nGT2FfY9KMrYVt8rT2YCW3GL73b2Fj2j4N56RMzHfcp_hW7fW6gW4dBzfRW3tZgJb6wB1JfVd0zbv35wh4RN8zbXKpnyfj6W6yM6K41NZprfN1PZNlPgv7zFW71lRcW8yGypBMnGzt-xFbw9N8TJbMTVfCwcW1YQHxz1GQtXKW657lCJ5fhKvjW1_8CNL4BTT7wW69P8Y64hksdCW80wSFy4CkbFPW1pPcF65bpn_JW7WZ7l285LvsQVWNwb38cgFp2W2DF0P046C5dqN7L0FQ2SrfSCW3yggzM7T60VNW6-9ws44Nq68yW5ghc8S3jzRf5W7NDz4_49hbllW1CCcl63gd1KmW2n5V8p5slbFjW7PgZ_T5vd89hMxFPvDlGMxDW3VqJG78dKTzXN46s6SqMbrmyW5L36lt6n-7WNW141ZBT444dDhW5t6Y8f8Z1MLWV4pX33282QyrW1j06VK7zr2Q6W7bcdfr591ZtSW43_Xkw4lPzBFW4h7jHc97dFs7W88ZFRD1GXrZpW9jWR8G6Xg9lQN3GBfHngxjrGf39tZ-n03">PlayStore</a></li>
            </ul>
            <p>Tambien puedes usar <a href="https://metamask.io/">Metamask</a></p>
        </Fragment>
        :
        <Fragment>
            { isOwner && !hidePanel ? 
                <div id="management">
                    <span className="close" onClick={ (e) => this.setState({'hidePanel': true})}>cerrar</span>
                    <WithdrawBalance />
                    <AddToken loadShipsForSale={this._loadShipsForSale} />
                </div> : '' 
            }
            <ShipList title="Mis Naves" id="myShips" list={myShips} onAction={(e) => this._loadEverything()} wallet={true}  />
            <MarketPlace list={marketPlaceShips} onAction={(e) => this._loadEverything()} />
            <ShipList title="Tienda" id="shipyard" list={shipsForSale} onAction={(e) => this._loadEverything()} />
        </Fragment>);
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
