const Router= require('express').Router();
const multer= require('multer');
const path= require('path');
const axios = require('axios');
const FormData = require('form-data');
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
const fs = require('fs');
const cardano = require('./cardano');
const storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./images');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});

function saveImage(filename, data){
    var myBuffer = new Buffer(data.length);
    for (var i = 0; i < data.length; i++) {
        myBuffer[i] = data[i];
    }
    fs.writeFile(filename, myBuffer, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
  }
  const createWallet = (account) => {
    try{
        paymentKeys = cardano.addressKeyGen(account);
        stakeKeys   = cardano.stakeAddressKeyGen(account);
        stakeAddr   = cardano.stakeAddressBuild(account);
        paymentAddr = cardano.addressBuild(account,{
            "paymentVkey": paymentKeys.vkey
        });
        
        return cardano.wallet(account);
    }
    catch(err){
        console.log(err)
    }

};

const upload= multer({storage:storage});

Router.post('/upload',upload.single('file'),async(req,res)=>{

    
 
    const form = new FormData();
    form.append('file',fs.createReadStream(`./${req.file.path}`));

    
    ipfs.util.addFromFs(`./${req.file.path}`, {recursive:true}, (err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data);
    })
}); 

Router.get('/get',(req,res)=>{
    ipfs.cat(req.body.hash, (err, stream)=>{
        if(err) throw err;
        res.json(stream);
    })
})

Router.get('/stats',async(req,res)=>{
    const stats = await ipfs.files.stat(`${req.body.filename}`)
    res.json(stats)
})

Router.get('/download',(req,res)=>{
    ipfs.cat(req.query.hash, (err, outStream)=>{
        if(err) throw err;
        

        res.send(outStream);

    })
})

Router.get('/createWallet',(req,res)=>{
    
    const sender=createWallet("ADA");
    res.json({"message":"Wallet Created send Ada","Address":sender.paymentAddr});

});

Router.get('/balance',(req,res)=>{
    const wallet= cardano.wallet("ADA");
    res.json(wallet.balance());
});

Router.post('/mint',async(req,res)=>{
    // 1. Get the wallet
    console.log(req.query.address);
    const wallet= cardano.wallet("ADA");
    let utxo= wallet.balance().utxo;
    
    if(utxo.length==0){
        return res.json({"message":"Make sure to send Ada if already sended pls wait for a few minutes"});
    }
    let hash =req.body.hash;
    let ipfsLink="ipfs://"+hash;
    // 2. Define mint script
    console.log("IPFS=>",ipfsLink);
    
    const mintScript = {
        keyHash: cardano.addressKeyHash(wallet.name),
        type: "sig"
    }
    
    // console.log("mintScript=>",mintScript);
    // 3. Create POLICY_ID
   
    const POLICY_ID= cardano.transactionPolicyid(mintScript)
    
    return res.json(POLICY_ID)
    //4.asset name Hex
    // const ASSET_NAME_HEX = assetName.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
    
    // // 5. Create ASSET_ID which os sum of ASSET_NAME_HEX and POLICY_ID
    // const ASSET_ID = POLICY_ID + "." + ASSET_NAME_HEX

    // // 6. Define metadata

    // const metadata = {
    //     721: {
    //         [POLICY_ID]: {
    //             [assetName]: {
    //                 name: assetName,
    //                 image: ipfsLink,
    //                 description: description,
    //                 type: rType,
               
    //             }
    //         }
    //     }
    // }
    // console.log("METADATA=>",metadata);
    // console.log("BEFORE TRANSACTIONS")
    // // 7. Define transaction

    // const tx = {
    //     txIn: wallet.balance().utxo,
    //     txOut: [
    //         {
    //             address: wallet.paymentAddr,
    //             value: { ...wallet.balance().value, [ASSET_ID]: 1 }
    //         }
    //     ],
    //     mint: [
    //         { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript },
    //     ],
    //     metadata,
    //     witnessCount: 2
    // }
     


    // if(Object.keys(tx.txOut[0].value).includes("undefined")|| Object.keys(tx.txIn[0].value.includes("undefinded"))){
    //     delete tx.txOut[0].value.undefined
    //     delete tx.txIn[0].value.undefined
    // }

    // // 8. Build transaction

    // const buildTransaction = (tx) => {

    //     const raw = cardano.transactionBuildRaw(tx)
    //     const fee = cardano.transactionCalculateMinFee({
    //         ...tx,
    //         txBody: raw./controller
    //     })

    //     tx.txOut[0].value.lovelace -= fee

    //     return cardano.transactionBuildRaw({ ...tx, fee })
    // }

    // console.log(tx)
    // const raw = buildTransaction(tx)

    // // 9. Sign transaction

    // const signTransaction = (wallet, tx) => {

    //     return cardano.transactionSign({
    //         signingKeys: [wallet.payment.skey, wallet.payment.skey ],
    //         txBody: tx
    //     })
    // }

    // const signed = signTransaction(wallet, raw)
    // console.log("SIGNED=>",signed);
    // // 10. Submit transaction

    // const txHash = cardano.transactionSubmit(signed)

    // res.json({"message":"Transaction Submitted","txHash":txHash});
});




module.exports= Router;