import EmbarkJS from 'Embark/EmbarkJS';
import web3 from "Embark/web3"
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import { Button, Grid, Row, Col } from 'react-bootstrap';

class WithdrawBalance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      isSubmitting: false
    }
  }

  componentDidMount(){
    // ============== BEGIN: Function implementation here ================ //
    this._getBalance();
    // ============== END: Function implementation here   ================ //
  }

  _getBalance(){
    // ============== BEGIN: Function implementation here ================ //
    // TODO: Update this.state.balance
    // ============== END: Function implementation here   ================ //

  }

  handleClick(e){
    // ============== BEGIN: Function implementation here ================ //
    e.preventDefault();

    // TODO: this method needs to extract the balance from the contract
    // and update the UI to show the new balance

    this.setState({isSubmitting: true});
    this._getBalance();
    this.setState({isSubmitting: false});
    // ============== END: Function implementation here   ================ //
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
