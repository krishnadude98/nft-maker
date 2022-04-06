# nft-maker
**Description-------------<br />**
This nft maker will store the image to ipfs and then mint NFT to the local wallet and after minting send it to the provided wallet address ,
It is using cardano blockchain for NFT 

**Prerequisite ----------<br />**

**01.** RUN CARDANO-NODE <br />
Run cardano-node in the system and run cardano node using the below script

`cardano-node run    --topology testnet-topology.json    --database-path db    --socket-path db/node.socket    --host-addr 127.0.0.1    --port 8081  --config testnet-config.json`


<br />*Important*<br />
Export the node.socket path `export CARDANO_NODE_SOCKET_PATH=YOUR_PATH/db/node.socket`

***If you don't have cardano-node installed in your system pls follow the below link***

[https://developers.cardano.org/docs/get-started/installing-cardano-node]

*check if the cardano-node is installed sucessfully using script*
`cardano-cli --version`
`cardano-node --version`

*download the configuration files for the 
**Testnet**

`curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-topology.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-shelley-genesis.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-config.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-byron-genesis.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-alonzo-genesis.json`

**Run the node**
`cardano-node run    --topology testnet-topology.json    --database-path db    --socket-path db/node.socket    --host-addr 127.0.0.1    --port 8081  --config testnet-config.json`
<br />

**02.** Install and run ipfs server<br />

For installation pls refer [https://docs.ipfs.io/install/command-line/#official-distributions] <br/>
check the installation `ipfs --version`<br />
now run ipfs `ipfs daemon`<br />

**API DOCUMENTATION ----------<br />**
**Prerequisite<br />**
cd to the file in which repo is cloned run the following comand <br />
`npm install` <br />
`npm run start` <br />

**01.Upload Image**
![Screenshot from 2022-04-01 14-04-21](https://user-images.githubusercontent.com/47265559/161226869-83b33000-ba03-47e7-bddf-00bbce28cda7.png)<br />

Endpoint:- `http://localhost:3000/ipfs/upload` <br />
FormData:- set key as file and choose key type as file and select the image you want to upload <br />
Output:- It is a object with ipfs hash save this hash for next api request <br />

**02.Check whether you are getting the image correctly <br />**

Open Chrome and paste url `http://localhost:3000/ipfs/view?hash=[YOUR_HASH]` YOUR_HASH is the hash copied from the previous api request <br />
![Screenshot from 2022-04-01 14-16-23](https://user-images.githubusercontent.com/47265559/161228917-16d849b9-e782-437c-90eb-bad56a593fd5.png) <br />

It will download the image <br />

**03.Create a local wallet** <br />
**Prerequisite<br />**
1.Pls download Nami extension in your chrome/ firefox and create a new account <br />
2.Click on Profile>>Settings>>Network and click on sidebar to move it to testnet <br />
3.Click recieve and copy your wallet address <br />
4.Now to go [https://testnets.cardano.org/en/testnets/cardano/tools/faucet/] get some test Adain yout Nami wallet <br />
![Screenshot from 2022-04-01 14-24-23](https://user-images.githubusercontent.com/47265559/161230306-c2ed8fb4-a009-4319-9c3b-6a1f14f79a5f.png) < br/>

**API**
Endpoint:- `http://localhost:3000/wallet/create` <br />
Output:- It will be a object with message and address copy that address and send atleast 10Ada to the address using Nami wallet click send and paste the address and amount (TAda can be transafered if and only if you recieved the TAda
from the previos step ) <br />
![Screenshot from 2022-04-01 14-26-30](https://user-images.githubusercontent.com/47265559/161231284-364647e4-9bbe-44b3-8b6f-afcc40188f41.png) < br/>

**04 Check the Balance of local wallet**

Endpoint:- `http://localhost:3000/wallet/balance` < br/>
Output:- output will be a object with utxo and value initially it is empty wait some time so that the amount sent from Nami wallet will get arrived after it will refelect go to next step <br />
![Screenshot from 2022-04-01 14-36-23](https://user-images.githubusercontent.com/47265559/161232376-1cb8eedc-2ec6-4061-bc60-943f1b059904.png)<br />

**05 Mint NFT**<br />
Endpoint:- `http://localhost:3000/nft/mint` <br />
Input:- Input contains hash which is  ipfs hash that we recieved when we upload the image , assetName ,description,rType can be any value <br />
Output:- Will be transaction hash and message now next step is to check the wallet balance using step 4 and wait till the asset is displayed in utxo (it will take a little time) <br />

![Screenshot from 2022-04-01 14-49-09](https://user-images.githubusercontent.com/47265559/161235128-f2158522-6216-433e-b485-ba00a5aeb356.png) <br />

**After the NFT is recieved in local wallet the utxo will look like this copy the highlighted text which is assetId (we want it to transfer the NFT  out to nami wallet) <br />**

![Screenshot from 2022-04-01 14-56-43](https://user-images.githubusercontent.com/47265559/161236121-fc677e73-949a-43ce-aeff-65e57bf90095.png) <br />

**06 Send the Minted NFT <br />** 
Endpoint:- `http://localhost:3000/nft/send` <br />
Input:- assetId will be pasted from the previos api call and address will be the nami wallet address in which we want to send the nft <br />
Output:- will be the message and transaction hash of the transaction

**Note:-** NFT will take some time to reflect in the wallet </br> 

![Screenshot from 2022-04-01 15-05-44](https://user-images.githubusercontent.com/47265559/161237637-a9355e75-2245-484f-a2eb-bf46b515af18.png) <br />

**AFTER SOME TIME THE MINTED NFT CAN BE VIEWED LIKE THIS ** <br />
![Screenshot from 2022-04-01 15-07-33](https://user-images.githubusercontent.com/47265559/161238111-4d133ad6-a56d-4756-b8fe-d9bb6643cbfd.png)


































