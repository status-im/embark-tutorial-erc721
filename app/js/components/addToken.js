import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, FormGroup, FormControl, InputGroup, Button, Grid, Row, Col, ControlLabel} from 'react-bootstrap';
import Spinner from 'react-spinkit';
import web3 from "Embark/web3"
import EmbarkJS from 'Embark/EmbarkJS';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';


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

    let attributes = {
      "name": "Spaceship",
      "image": "", 
      "attributes": {
        "energy": this.state.energy,
        "lasers": this.state.lasers,
        "shield": this.state.shield
      }
    }

    const { mint } = SpaceshipToken.methods;
    let toSend;

    EmbarkJS.Storage.uploadFile(this.state.fileToUpload)
    .then(fileHash => {
      attributes.image = 'https://ipfs.io/ipfs/' + fileHash;
      return EmbarkJS.Storage.saveText(JSON.stringify(attributes))
    })
    .then(attrHash => {
      toSend = mint(web3.utils.toHex(attrHash), 
                          this.state.energy, 
                          this.state.lasers, 
                          this.state.shield,
                          web3.utils.toWei(this.state.price, "ether"));
      return toSend.estimateGas();
    })
    .then(estimatedGas => {
      return toSend.send({gas: estimatedGas + 1000});
    })
    .then(receipt => {
      console.log(receipt);
      this.setState({
        energy: '',
        lasers: '',
        shield: '',
        price: ''
      });
      this.props.loadShipsForSale();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      this.setState({isSubmitting: false});
    });
  }

  render(){
    return <Grid>
            <h4>Create Spaceship</h4>
            <FormGroup>
              <Row>
                <Col sm={2} md={2}>
                  <ControlLabel><i className="fa fa-dashboard" aria-hidden="true"></i> Energy</ControlLabel>                  
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
                  <ControlLabel><i className="fa fa-shield" aria-hidden="true"></i> Shields</ControlLabel>                  
                  <FormControl
                    type="text"
                    value={this.state.shield}
                    onChange={(e) => this.handleChange('shield', e.target.value)} />
                </Col>
                <Col sm={2} md={2}>
                  <ControlLabel>Price</ControlLabel>                  
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={this.state.price}
                      onChange={(e) => this.handleChange('price', e.target.value)} />                
                      <InputGroup.Addon>Ξ</InputGroup.Addon>
                  </InputGroup>
                </Col>
                <Col sm={4} md={4}>
                  <ControlLabel>Image</ControlLabel>                  
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
                    : <Button disabled={this.state.isSubmitting} onClick={(e) => this.handleClick(e)}>Create</Button>
                  }
                </Col>
              </Row>
            </FormGroup>
          </Grid>;
  }
}

export default AddToken;
