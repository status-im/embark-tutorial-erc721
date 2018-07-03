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
    // TODO: Al cargar el componente, debemos obtener el balance
    // podemos hacerlo llamando a this._getBalance();
  }

  _getBalance(){
    // TODO: implementar, el estado a actualizar es 'balance'
    
  }

  handleClick(e){
    e.preventDefault();

    // TODO: este metodo se debe llamar al hacer click en retirar fondos
    // Debe extraer el balance total del contrato del token, y actualizar el UI
    // para mostrar que no hay balance disponible

    this.setState({isSubmitting: true});
    this._getBalance();
    this.setState({isSubmitting: false});
  }

  render(){
    const { balance } = this.state;
    return <Grid>
        <h4>Fondos</h4>
        <Row>
          <Col sm={3} md={3}>
            Balance Disponible: <b>{ balance } Ξ</b>              
            <Button onClick={(e) => this.handleClick(e)} disabled={balance == "0"}>Retirar</Button>
          </Col>
        </Row>
      </Grid>;
  }
}

export default WithdrawBalance;
