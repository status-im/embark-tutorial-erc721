import EmbarkJS from 'Embark/EmbarkJS';
import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
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

    const { mint } = SpaceshipToken.methods;

    this.setState({isSubmitting: true});

    // TODO:
    let attributes = {
    }

    // Cargamos la imagen a IPFS
    EmbarkJS.Storage.uploadFile(this.state.fileToUpload)
    .then(fileHash => {
      // Agregamos los datos a la lista de atributos
      attributes.imageHash = fileHash;

      // Guardamos la lista de atributos
      return EmbarkJS.Storage.saveText(JSON.stringify(attributes))
    })
    .then(attrHash => {

      // El hash que retorna IPFS se almacenara dentro de los datos del token
      // El precio lo convertimos de ether a wei
      const toSend = mint(web3.utils.toHex(attrHash), 
                          this.state.energy, 
                          this.state.lasers, 
                          this.state.shield,
                          web3.utils.toWei(this.state.price, "ether"));
      
      toSend.estimateGas()
      .then(estimatedGas => {
        return toSend.send({from: web3.eth.defaultAccount,
                            gas: estimatedGas + 1000});
      })
      .then(receipt => {
        console.log(receipt);

        // Vaciar formulario
        this.setState({
          fileToUpload: [],
          energy: '',
          lasers: '',
          shield: '',
          price: ''
        });

        this.props.loadShipsForSale();

        // TODO: show success

        return true;
      })
      .catch((err) => {
        console.error(err);
        // TODO: show error blockchain
        
      })
      .finally(() => {
        this.setState({isSubmitting: false});
      });
    })
    .catch((err) => {
      // TODO: show error uploading file
      console.error(err);
    })
    .finally(() => {
      this.setState({isSubmitting: false});
    })
  }

  render(){
    return <Grid>
            <h4>Crear nave</h4>
            <FormGroup>
              <Row>
                <Col sm={2} md={2}>
                  <ControlLabel>Energ&iacute;a</ControlLabel>                  
                  <FormControl
                    type="text"
                    value={this.state.energy}
                    onChange={(e) => this.handleChange('energy', e.target.value)} />
                </Col>
                <Col sm={2} md={2}>
                  <ControlLabel>Lasers</ControlLabel>                  
                  <FormControl
                    type="text"
                    value={this.state.lasers}
                    onChange={(e) => this.handleChange('lasers', e.target.value)} />
                </Col>
                <Col sm={2} md={2}>
                  <ControlLabel>Escudo</ControlLabel>                  
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
                  <Button disabled={this.state.isSubmitting} onClick={(e) => this.handleClick(e)}>Crear</Button>
                </Col>
                <Col sm={1} md={1}>
                  { this.state.isSubmitting ? <Spinner name="wave" color="coral"/> : '' }
                </Col>
              </Row>
            </FormGroup>
          </Grid>;
  }
}

export default AddToken;
