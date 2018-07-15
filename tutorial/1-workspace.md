## Setting up the workspace

Before starting, it's important to have setup correctly our workspace. You can follow the steps described in the [documentation](https://embark.status.im/docs/), since it will always be updated to reflect latest changes in the framework. If you already have Embark and its dependencies installed you can skip this step.

At the moment of writing the tutorial, the commands I used on Ubuntu 18.04 were these. Some steps change depending on the operative system used (i.e. [node-gyp](https://github.com/nodejs/node-gyp)), as well as the versions of files. Please refer to Embark or any of the installed tools docs for troubleshooting. Also a [docker image](https://github.com/embark-framework/embark-docker/) is being built with Embark and all its dependencies, and it may be used to follow this tutorial.

## Ubuntu Installation

### NodeJS 9.8.0 (lts) with nvm 0.33.11
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
bash .bashrc
nvm install --lts
```
### Go-ethereum 1.8.11
```
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get install ethereum
```

### IPFS 0.4.15
```
curl -O https://dist.ipfs.io/go-ipfs/v0.4.15/go-ipfs_v0.4.15_linux-amd64.tar.gz
tar xvfz go-ipfs_v0.4.15_linux-amd64.tar.gz
cd go-ipfs
sudo ./install.sh
ipfs init
```

### Other tools and dependencies
```
apt install python git build-essential
npm install node-gyp -g
npm install ganache-cli -g
```

### Embark
```
npm install -g embark
```

After all thesese dependencies and embark are installed, proceed to fork/clone the dapp repository using

```
git clone https://github.com/status-im/status-dapp-workshop-mexico.git
```
And proceed to install the npm packages this project uses

```
cd status-dapp-workshop-mexico
npm install
```

Once all the packages are installed, execute embark via `embark run` in the same directory. You should see the following screen:
![Dashboard](https://raw.githubusercontent.com/status-im/status-dapp-workshop-mexico/tutorial-series/tutorial/images/dashboard.png)
