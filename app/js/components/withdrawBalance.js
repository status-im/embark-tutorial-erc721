import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3"
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import { Button } from 'react-bootstrap';

class WithdrawBalance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      isSubmitting: false
    }
  }

  componentDidMount(){
    EmbarkJS.onReady((err) => {
      this._getBalance();
    });
  }

  _getBalance(){
    web3.eth.getBalance(SpaceshipToken.options.address)
      .then(newBalance => {
        this.setState({
          balance: web3.utils.fromWei(newBalance, "ether")
        });
      });
    
  }

  handleClick(e){
    const { withdrawBalance } = SpaceshipToken.methods;

    e.preventDefault();

    this.setState({isSubmitting: true});


    const toSend = withdrawBalance();
    toSend.estimateGas()
      .then(estimatedGas => {
          return toSend.send({from: web3.eth.defaultAccount,
                              gas: estimatedGas + 1000});
      })
      .then(receipt => {
        console.log(receipt);
        this._getBalance();
        // TODO mostrar info

        return true;
      })
      .catch((err) => {
        console.error(err);
        // TODO: mostrar error
      })
      .finally(() => {
        this.setState({isSubmitting: false});
      });
  }

  render(){
    const { balance } = this.state;
    return <Fragment>
      { balance } Ξ
      {<Button onClick={(e) => this.handleClick(e)} disabled={balance == "0"}>withdraw</Button>}
      </Fragment>;
  }
}

export default WithdrawBalance;
