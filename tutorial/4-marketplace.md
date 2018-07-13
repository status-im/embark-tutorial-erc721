## Selling our tokens
A functionality a token marketplace requires is the ability to list and sell your tokens and also be able to buy them. ERC721 and tokens in general require an approval to be able to transfer them. And since we're going to use a different contract to act as an escrow for our buys/sell, we need to allow the user to approve this contract as a temporary owner of our tokens to sell.

![Selling Ships](https://raw.githubusercontent.com/status-im/status-dapp-workshop-mexico/tutorial-series/tutorial/images/sellingShip.png)


This approval process will be controlled via the toggle above our spaceships section, and this functionality shall be code on `app/js/components/shipList.js`.

Start by importing our escrow contract `SpaceshipMarketplace`, `EmbarkJS` and our `SpaceshipToken` contract:

```
import EmbarkJS from 'Embark/EmbarkJS';
import SpaceshipToken from 'Embark/contracts/SpaceshipToken';
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';
```

We need to work now on the `enableMarketplace()` method that is triggered when you click on the toggle button. Use the function `setApprovalForAll` of the `SpaceshipToken`. This function will receive the address of the `SpaceshipMarketplace` contract and will let it act as an operator of our tokens. As usual when sending transactions, we need to estimate the gas first:

```
enableMarketplace = () => {
    this.setState({isSubmitting: true});

    const { setApprovalForAll } = SpaceshipToken.methods;

    const toSend = setApprovalForAll(SpaceshipMarketplace.options.address, !this.state.salesEnabled);

    toSend.estimateGas()
    .then(estimatedGas => {
        console.log(estimatedGas);
    })
    .catch((err) => {
        console.error(err);       
    })
    .finally(() => {
        this.setState({isSubmitting: false});
    });
}
```

After estimating the gas cost, we may now send the transaction. We will set the state `salesEnabled` to the inverse of its current value (to represent a toggle click):

```
enableMarketplace = () => {
    this.setState({isSubmitting: true});

    const { setApprovalForAll } = SpaceshipToken.methods;

    const toSend = setApprovalForAll(SpaceshipMarketplace.options.address, !this.state.salesEnabled);

    toSend.estimateGas()
    .then(estimatedGas => {
        return toSend.send({gas: estimatedGas + 1000});
    })
    .then(receipt => {
        this.setState({salesEnabled: !this.state.salesEnabled});
        console.log(receipt);
    })
    .catch((err) => {
        console.error(err);       
    })
    .finally(() => {
        this.setState({isSubmitting: false});
    });
}
```

The next step is to set the correct toggle state when we load the page. We will use the `isApprovedForAll` to query the approval state from the contract, and this will be done as soon as the component mounts and `EmbarkJS` finish loading:

```
componentDidMount(){
    EmbarkJS.onReady((err) => {
        const { isApprovedForAll } = SpaceshipToken.methods;
        isApprovedForAll(web3.eth.defaultAccount, SpaceshipMarketplace.options.address)
        .call()
        .then(isApproved => {
            this.setState({salesEnabled: isApproved});
        });
    });
}
```

![Toggle Button](https://raw.githubusercontent.com/status-im/status-dapp-workshop-mexico/tutorial-series/tutorial/images/toggle.png)


Finally, to sell our tokens, we need to edit the file `app/js/components/ship.js` to import our `SpaceshipMarketplace` contract and add the implementation of the `sellShip` method.

```
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';
```

The function you need to use from the `SpaceshipMarketplace` contract is `forSale`, which receives a token id (you can get it from `this.props.id`), and also a price (`this.state.sellPrice`). Remember that in the UI we're introducing the sell price as ether, and we need to convert it to wei:

```
sellShip = () => {
    const { forSale } = SpaceshipMarketplace.methods;
    const { sellPrice } = this.state;
    const { id } = this.props;

    this.setState({isSubmitting: true});

    const toSend = forSale(id, web3.utils.toWei(sellPrice, 'ether'))

    toSend.estimateGas()
    .then(estimatedGas => {
        return toSend.send({gas: estimatedGas + 1000});
    })
    .then(receipt => {
        console.log(receipt);
        this.props.onAction(); // Update ship lists
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        this.setState({isSubmitting: false});
    });
}
```

## Listing marketplace tokens

Our DApp doesn't show the any ships in the marketplace yet. We need to edit `app/js/index.js` to include this functionality. Import the `SpaceshipMarketplace` contract since this file doesn't have a reference to it:

```
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';
```

We'll implement the `_loadMarketPlace` method. This is similar to the other listing methods, the main difference is that we use the `SpaceshipMarketplace` contract functions:

- `nSale` to obtain the number of ships for sale in the marketplace
- `sales` which receives an index and returns the sale information (the token id, the owner, and price)

```
_loadMarketPlace = async () => {
    const { nSale, sales } = SpaceshipMarketplace.methods;
    const { spaceships } = SpaceshipToken.methods;

    const list = [];

    const total = await nSale().call();
    if(total){
        for (let i = total-1; i >= 0; i--) {
            const sale = await sales(i).call();
            const info = await spaceships(sale.spaceshipId).call();
            const ship = {
                owner: sale.owner,
                price: sale.price,
                id: sale.spaceshipId,
                saleId: i,
                ...info
            };
            list.push(ship);
        }
    }
    this.setState({marketPlaceShips: list.reverse()});
}
```

Notice that we include new attributes in our list: the owner, and the saleId which is used in the next step, and also, `this.state.marketPlaceShips` is used to store the list of spaceships in the marketplace

![Marketplace](https://raw.githubusercontent.com/status-im/status-dapp-workshop-mexico/tutorial-series/tutorial/images/marketplace.png)

## Buying tokens from the marketplace
This functionality is very similar to buying the tokens from the store.
The difference being that we use the `SpaceshipMarketplace` contract instead of the `SpaceshipToken`. Go back to `app/js/components/ship.js` and work on the method `buyFromMarket`. The function we're going to use from the contract is `buy`, which receives a `saleId` you can find in the props:

```
buyFromMarket = () => {
    this.setState({isSubmitting: true});

    const { buy } = SpaceshipMarketplace.methods;
    const toSend = buy(this.props.saleId);
}
```

The next step as you may have guessed already, is to estimate gas costs and sending the transaction with extra gas: 

```
buyFromMarket = () => {
    this.setState({isSubmitting: true});

    const { buy } = SpaceshipMarketplace.methods;
    const toSend = buy(this.props.saleId);

    toSend.estimateGas({value: this.props.price })
    .then(estimatedGas => {
        return toSend.send({value: this.props.price,
                            gas: estimatedGas + 1000000});
    })
    .then(receipt => {
        console.log(receipt);
        this.props.onAction(); // Call this to reload spaceship lists
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        this.setState({isSubmitting: false});
    });
}
```

## Other features
Congrats! you have implemented all the features of this tutorial! However, there's still some missing functionality on this DApp that would be great to build, and probably make sense to include, such as: Add validations to input fields, warning messages, Allow the user to cancel sales, to tranfer tokens to other addresses, trading tokens offchain (maybe through Whisper?), etc. This tutorial covers most of the patterns required to implement them, so if you're looking for an extra challenge, you can have fun building them!

## Conclusion

As you can see, interacting with Ethereum and IPFS is easy using Embark, and lets you build truly decentralized applications fast! Are you interested in learning more or contributing to this framework? Visit http://embark.status.im or chat with us on [Gitter](https://embark.status.im/chat/)
