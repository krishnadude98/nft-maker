const express= require('express');
const app= express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

//Routes
let walletRoutes= require('./routes/wallet');
let ipfsRoute= require('./routes/ipfs');
let nftRoutes= require('./routes/nft');


app.use('/wallet',walletRoutes);
app.use('/ipfs',ipfsRoute);
app.use('/nft',nftRoutes);




module.exports =app;
