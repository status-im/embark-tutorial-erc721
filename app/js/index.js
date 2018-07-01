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
        const { isOwner } = this.state;

        return (
        <Fragment>
            <MyShips />
            <Shipyard />
            { isOwner ? 
                <Fragment>
                    <WithdrawBalance />
                    <AddToken />
                </Fragment> : '' 
            }
            
        </Fragment>);
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
