## DApp overview
The DApp will be running in http://localhost:8000 . This URL will present a simple site called CryptoSpaceShips, with a form to create the tokens (In this case each token representing a unique spaceship with its own attributes), also, it lists all the tokens you own, that you can buy from the store, and can buy/sell in the market.

[IMAGE_HERE]

## Minting tokens
Each spaceship in this dapp is an ERC721 token, and as such, they have their own characteristics. Since they represent an spaceship (which could be used in a game), the attributes they will have are: lasers, shields, and energy, as well as an image.

The contract we will use to represent the spaceships is `SpaceshipToken` and it is located in the file:  `contracts\SpaceshipToken.sol`. 

> Embark will attempt to deploy all the contracts it finds in the `contracts` folder and their dependencies. For this project, we already pre-configured the contracts we will and will not deploy. You can read more about this in the [documentation](https://embark.status.im/docs/contracts.html#Specify-contract-file).

For minting the tokens we will use a combination of IPFS to store the image and attributes, and the function `mint(bytes _metadataHash, uint8 _energy,  uint8 _lasers, uint8 _shield, uint _price) public onlyOwner`.

Let's edit the file `app/js/components/addToken.js` which contains the form to add tokens:

#### Importing Embark and contracts
Before being able to interact with the EVM, and with IPFS, you need to import both EmbarkJS and the contract file:
```
import EmbarkJS from 'Embark/EmbarkJS';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
```

### Adding functionality to the Create button
[IMAGE_HERE]

When you click on the 'Create' button, it will invoke the `handleClick(e)` method which doesn't have a useful implementation at the moment. Let's start by loading the image into IPFS.

#### Creating attributes
Each ERC721 may have an optional list of attributes or metadata that follows the "ERC721 Metadata JSON Schema". We'll start by creating a json object that contains this metadata using the values from the input fields:

```
let attributes = {
    "name": "Spaceship",
    "image": "", 
    "attributes": {
    "energy": this.state.energy,
    "lasers": this.state.lasers,
    "shield": this.state.shield
    }
}
```
Notice that the image attribute is empty because we still don't know the url of the image, we need to upload it to IPFS first. 

#### Uploading image to IPFS
To upload the image file, we'll use `uploadFile(inputFile[])` function of Embark.Storage which returns a promise, and after the promise resolves, we'll add the image hash to our attributes object. We also will add a `catch` block to display any error we receive on the browser console, as well as a `finally` block for enabling the `Create` button after the file upload.

```
EmbarkJS.Storage.uploadFile(this.state.fileToUpload)
.then(fileHash => {
    attributes.image = 'https://ipfs.io/ipfs/' + fileHash;
})
.catch((err) => {
    console.error(err);
})
.finally(() => {
    // Verify our object has a image attribute
    console.log(attributes);
    this.setState({isSubmitting: false});
});
```

#### Uploading attributes to IPFS
An ERC721 token that supports the metadata standard needs to return an URI with all the attribute info of the token when the `tokenURI(uint256 _tokenId)` function of the contract is invoked. Since IPFS already provides an URL for all the resources it has, we will proceed to store the attributes object in IPFS an return its URL when we invoke that function. We will start by modifying our then() implementation by calling the `saveText(text)` method of Embark.Storage. This also returns a promise, and we will deal with it in the next step.

```
EmbarkJS.Storage.uploadFile(this.state.fileToUpload)
.then(fileHash => {
    attributes.image = 'https://ipfs.io/ipfs/' + fileHash;

    // Saving our attributes object in IPFS
    return EmbarkJS.Storage.saveText(JSON.stringify(attributes))
})
.then(attrHash => {
    console.log(attrHash);
})
.catch((err) => {
    console.error(err);
})
.finally(() => {
    this.setState({isSubmitting: false});
});
```

#### Using our contract to mint the new token



### Full implementation of the handleClick(e) function:
```
handleClick(e){
    e.preventDefault();

    const { mint } = SpaceshipToken.methods;

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
      return toSend.send({from: web3.eth.defaultAccount,
                          gas: estimatedGas + 1000});
    })
    .then(receipt => {
      console.log(receipt);
      this.setState({
        fileToUpload: [],
        energy: '',
        lasers: '',
        shield: '',
        price: ''
      });

      this.props.loadShipsForSale();
      return true;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      this.setState({isSubmitting: false});
    });
}
```
