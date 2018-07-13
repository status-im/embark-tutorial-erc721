import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3";
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';

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
    e.preventDefault();
    this.setState({isSubmitting: true});

    const { withdrawBalance } = SpaceshipToken.methods;

    const toSend = withdrawBalance();
    toSend.estimateGas()
    .then(estimatedGas => {
        return toSend.send({gas: estimatedGas + 1000});
    })
    .then(receipt => {
        console.log(receipt);
        this._getBalance();
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        this.setState({isSubmitting: false});
    });
  }

  render(){
    const { balance } = this.state;
    return <Grid>
        <Row>
          <Col sm={3} md={3}>
            Balance: <b>{ balance } Ξ</b>              
            <Button onClick={(e) => this.handleClick(e)} disabled={balance == "0"}>Withdraw</Button>
          </Col>
        </Row>
      </Grid>;
  }
}

export default WithdrawBalance;
