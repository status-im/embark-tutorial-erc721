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

Our DApp doesn't show the any ships in the marketplace. We need to edit `app/js/index.js` to include this functionality. This file doesn't have a reference to the `SpaceshipMarketplace` contract, you need to import it:

```
import SpaceshipMarketplace from 'Embark/contracts/SpaceshipMarketplace';
```


    _loadMarketPlace = async () => {
        const { nSale, sales, saleInformation } = SpaceshipMarketplace.methods;
        const { spaceships } = SpaceshipToken.methods;
   
        const total = await nSale().call();
        const list = [];
        if(total){
          for (let i = total-1; i >= 0; i--) {
            const sale = await sales(i).call();
            const _info = await spaceships(sale.spaceshipId).call();
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

The next step as you may have guessed, is to estimate gas costs and sending the transaction with extra gas: 

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
Congrats! you have implemented all the features of this tutorial! However, there's still some missing functionality on this DApp that would be great to build, and probably make sense to include, such as: Allow the user to cancel sales, to tranfer tokens to other addresses, trading tokens offchain (maybe through Whisper?), etc. This tutorial covers most of the patterns required to implement them, so if you're looking for an extra challenge, you can have fun building these!

## Conclusion

As you can see, interacting with Ethereum and IPFS is easy using Embark, and lets you build truly decentralized applications fast! Are you interested in learning more or contributing to this framework? Visit http://embark.status.im or chat with us on [Gitter](https://embark.status.im/chat/)