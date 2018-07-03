import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, FormGroup, FormControl, InputGroup, Button, Grid, Row, Col, ControlLabel} from 'react-bootstrap';
import Spinner from 'react-spinkit';


class AddToken extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      fileToUpload: [],
      energy: '',
      lasers: '',
      shield: '',
      price: ''
    }
  }

  handleChange(fieldName, value) {
    this.state[fieldName] = value;
    this.setState(this.state);
  }

  handleClick(e){
    e.preventDefault();

    this.setState({isSubmitting: true});

    // TODO: Implementar llamada al contrato para crear el token
    // Un token espera los siguientes atributos: energy, lasers, shield and price
    // al igual que una imagen
    // La siguiente funcion se puede llamar para actualizar la lista de tokens
    this.props.loadShipsForSale();
    this.setState({isSubmitting: false});
  }

  render(){
    return <Grid>
            <h4>Crear nave</h4>
            <FormGroup>
              <Row>
                <Col sm={2} md={2}>
                  <ControlLabel><i className="fa fa-dashboard" aria-hidden="true"></i> Energ&iacute;a</ControlLabel>                  
                  <FormControl
                    type="text"
                    value={this.state.energy}
                    onChange={(e) => this.handleChange('energy', e.target.value)} />
                </Col>
                <Col sm={2} md={2}>
                  <ControlLabel><i className="fa fa-rocket" aria-hidden="true"></i> Lasers</ControlLabel>                  
                  <FormControl
                    type="text"
                    value={this.state.lasers}
                    onChange={(e) => this.handleChange('lasers', e.target.value)} />
                </Col>
                <Col sm={2} md={2}>
                  <ControlLabel><i className="fa fa-shield" aria-hidden="true"></i> Escudo</ControlLabel>                  
                  <FormControl
                    type="text"
                    value={this.state.shield}
                    onChange={(e) => this.handleChange('shield', e.target.value)} />
                </Col>
                <Col sm={2} md={2}>
                  <ControlLabel>Precio</ControlLabel>                  
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={this.state.price}
                      onChange={(e) => this.handleChange('price', e.target.value)} />                
                      <InputGroup.Addon>Ξ</InputGroup.Addon>
                  </InputGroup>
                </Col>
                <Col sm={4} md={4}>
                  <ControlLabel>Imagen</ControlLabel>                  
                  <FormControl
                    type="file"
                    onChange={(e) => this.handleChange('fileToUpload', [e.target])} />
                </Col>
              </Row>
              <Row>
                <Col sm={1} md={1}>
                  {
                    this.state.isSubmitting 
                    ? <Spinner name="wave" color="coral"/>
                    : <Button disabled={this.state.isSubmitting} onClick={(e) => this.handleClick(e)}>Crear</Button>
                  }
                </Col>
              </Row>
            </FormGroup>
          </Grid>;
  }
}

export default AddToken;
