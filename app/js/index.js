import EmbarkJS from 'Embark/EmbarkJS';
import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import Shipyard from './components/shipyard.js';
import WithdrawBalance from './components/withdrawBalance.js';
import AddToken from './components/addToken.js';
import MyShips from './components/myShips.js';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOwner: false,
            hidePanel: false
        }
    }

    componentDidMount(){
        EmbarkJS.onReady((err) => {
            this._isOwner();
        });
    }

    _isOwner(){
        SpaceshipToken.methods.owner()
            .call()
            .then(owner => {
                this.setState({isOwner: owner == web3.eth.defaultAccount});
                return true;
            });
    }

    render(){
        const { isOwner, hidePanel } = this.state;

        return (
        <Fragment>
            { isOwner && !hidePanel ? 
                <div id="management">
                    <span className="close" onClick={ (e) => this.setState({'hidePanel': true})}>cerrar</span>
                    <WithdrawBalance />
                    <AddToken />
                </div> : '' 
            }
            <MyShips />
            <Shipyard />
        </Fragment>);
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
