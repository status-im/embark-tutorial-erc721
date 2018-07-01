import EmbarkJS from 'Embark/EmbarkJS';
import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import { Form, FormGroup, FormControl, InputGroup, HelpBlock, Button } from 'react-bootstrap';
 
const emptyState = {
  fileToUpload: '',
  HP: '',
  attack: '',
  defense: '',
  speed: '',
  cooldown: '',
  price: ''
}

class AddToken extends Component {

  constructor(props) {
    super(props);

    this.state = {
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

    // TODO:
    let attributes = {
    }
    EmbarkJS.Storage.uploadFile(this.state.fileToUpload)
    .then(fileHash => {
      attributes.imageHash = fileHash;
      return EmbarkJS.Storage.saveText(JSON.stringify(attributes))
    })
    .then(attrHash => {
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

        // TODO: show success
      })
      .catch((err) => {
        console.error(err);
        // TODO: show error blockchain
        
      })
    })
    .catch((err) => {
      // TODO: show error uploading file
      console.error(err);
    })
  }

  render(){
    return <div id="addToken">
      <Form>
            <FormGroup>
              Energ&iacute;a
              <FormControl
                type="text"
                value={this.state.energy}
                onChange={(e) => this.handleChange('energy', e.target.value)} />

              Lasers
              <FormControl
                type="text"
                value={this.state.lasers}
                onChange={(e) => this.handleChange('lasers', e.target.value)} />


              Escudo
              <FormControl
                type="text"
                value={this.state.shield}
                onChange={(e) => this.handleChange('shield', e.target.value)} />

              Precio
              <InputGroup>
                <FormControl
                  type="text"
                  value={this.state.price}
                  onChange={(e) => this.handleChange('price', e.target.value)} />                
                  <InputGroup.Addon>Ξ</InputGroup.Addon>
              </InputGroup>
               
              Imagen
              <FormControl
                type="file"
                onChange={(e) => this.handleChange('fileToUpload', [e.target])} />

              <Button bsStyle="primary" onClick={(e) => this.handleClick(e)}>Create</Button>
            </FormGroup>
          </Form>

    </div>;
  }
}

export default AddToken;
