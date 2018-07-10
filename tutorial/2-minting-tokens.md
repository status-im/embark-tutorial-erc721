## DApp overview
The DApp will be running in http://localhost:8000 . This URL will present a simple site called CryptoSpaceShips, with a form to create the tokens (In this case each token representing a unique spaceship with its own attributes), also, it lists all the tokens you own, that you can buy from the store, and can buy/sell in the market.

[IMAGE_HERE]

## Minting tokens
Each spaceship in this dapp is an ERC721 token, and as such, they have their own characteristics. Since they represent an spaceship (which could be used in a game), the attributes they will have are: lasers, shields, and energy, as well as an image.

 The contract we will use to represent the spaceships is `SpaceshipToken` and it is located in the file:  `contracts\SpaceshipToken.sol`. 
 
 > Embark will attempt to deploy all the contracts it finds in the `contracts` folder and their dependencies. For this project, we already pre-configured the contracts we will and will not deploy. You can read more about this in the [documentation](https://embark.status.im/docs/contracts.html#Specify-contract-file).

 For minting the tokens we will use a combination of IPFS to store the image and attributes, and the function `mint(bytes _metadataHash, uint8 _energy,  uint8 _lasers, uint8 _shield, uint _price) public onlyOwner`.

 Let's edit the file `app/js/components/addToken.js` which contains the form to add tokens:

