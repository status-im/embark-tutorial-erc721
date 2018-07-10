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

    // ============== BEGIN: Function implementation here ================ //
    
    // TODO: Implement call to the contract to create a token
    // A token expects the followin attributes: energy, lasers, shield and price
    // and a metadataHash that contains the attribute list

    // TODO: the next function needs to be invoked to update the list of spaceships
    this.props.loadShipsForSale();

    // TODO: remember to update isSubmitting to false to enable the create button

    this.setState({isSubmitting: false});
    // ============== END: Function implementation here  ================ // 
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
