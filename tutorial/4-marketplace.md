## Selling our tokens

shiplist.js
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';

  componentDidMount(){
    EmbarkJS.onReady((err) => {
        // Al cargar la lista de naves, determinamos si estan aprobadas para la venta
        const { isApprovedForAll } = SpaceshipToken.methods;
        isApprovedForAll(web3.eth.defaultAccount, SpaceshipMarketplace.options.address)
            .call()
            .then(isApproved => {
                this.setState({salesEnabled: isApproved});
            });
    });
  }

  enableMarketplace = () => {
    const { setApprovalForAll } = SpaceshipToken.methods;

    this.setState({isSubmitting: true});

    const toSend = setApprovalForAll(SpaceshipMarketplace.options.address, !this.state.salesEnabled);

    toSend.estimateGas()
        .then(estimatedGas => {
            return toSend.send({from: web3.eth.defaultAccount,
                                gas: estimatedGas + 1000});
        })
        .then(receipt => {
            this.setState({salesEnabled: !this.state.salesEnabled});
            console.log(receipt);
        })
        .catch((err) => {
            console.error(err);
            // TODO: show error blockchain
            
        })
        .finally(() => {
          this.setState({isSubmitting: false});
        });
  }


ship.js

import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';

    sellShip = () => {
        const { forSale } = SpaceshipMarketplace.methods;
        const { sellPrice } = this.state;
        const { id } = this.props;

        this.setState({isSubmitting: true});

        const toSend = forSale(id, web3.utils.toWei(sellPrice, 'ether'))

        toSend.estimateGas()
            .then(estimatedGas => {
                return toSend.send({from: web3.eth.defaultAccount,
                                    gas: estimatedGas + 1000});
            })
            .then(receipt => {
                console.log(receipt);
                
                this.props.onAction();

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
    }

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
                ..._info
            };
            list.push(ship);
        }
    }
    this.setState({marketPlaceShips: list.reverse()});
}
```

Notice that we include new attributes in our list: the owner, and the saleId which is used in the next step, and also, `this.state.marketPlaceShips` is used to store the list of spaceships in the marketplace

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
Congrats! you have implemented all the features of this tutorial! However, there's still some missing functionality on this DApp that would be great to build, and probably make sense to include, such as: Allow the user to cancel sales, to tranfer tokens to other addresses, trading tokens offchain (maybe through Whisper?), etc. This tutorial covers most of the patterns required to implement them, so if you're looking for an extra challenge, you can have fun building them!

## Conclusion

As you can see, interacting with Ethereum and IPFS is easy using Embark, and lets you build truly decentralized applications fast! Are you interested in learning more or contributing to this framework? Visit http://embark.status.im or chat with us on [Gitter](https://embark.status.im/chat/)