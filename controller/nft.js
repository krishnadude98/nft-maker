const nftController={};
const cardano = require('../services/cardano');


nftController.post=async(req,res)=>{
    const wallet= cardano.wallet("ADA");
    let utxo= wallet.balance().utxo;
    let {hash,assetName,description,rType}=req.body;
    if(hash==undefined||assetName==undefined||rType==undefined||description==undefined){
        return(res.json({"message":"Please provide all the required fields"}));

    }
    if(utxo.length==0){
        return res.json({"message":"Make sure to send Ada if already sended pls wait for a few minutes"});
    }
   
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
    
     
     
    //4.asset name Hex
    const ASSET_NAME_HEX = assetName.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
    
     // 5. Create ASSET_ID which os sum of ASSET_NAME_HEX and POLICY_ID
    const ASSET_ID = POLICY_ID + "." + ASSET_NAME_HEX
    
     // 6. Define metadata

    const metadata = {
         721: {
             [POLICY_ID]: {
                 [assetName]: {
                     name: assetName,
                     image: ipfsLink,
                     description: description,
                     type: rType,
               
                 }
             }
         }
     }
    
     // 7. Define transaction

     const tx = {
         txIn: wallet.balance().utxo,
         txOut: [
             {
                 address: wallet.paymentAddr,
                 value: { ...wallet.balance().value, [ASSET_ID]: 1 }
             }
         ],
         mint: [
             { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript },
         ],
         metadata,
         witnessCount: 2
     }
     


     if(Object.keys(tx.txOut[0].value).includes("undefined")|| Object.keys(tx.txIn[0].value.includes("undefinded"))){
         delete tx.txOut[0].value.undefined
         delete tx.txIn[0].value.undefined
     }

     // 8. Build transaction

     const buildTransaction = (tx) => {

         const raw = cardano.transactionBuildRaw(tx)
         const fee = cardano.transactionCalculateMinFee({
             ...tx,
             txBody: raw
         })

         tx.txOut[0].value.lovelace -= fee

         return cardano.transactionBuildRaw({ ...tx, fee })
     }

     console.log(tx)
     const raw = buildTransaction(tx)

     // 9. Sign transaction

     const signTransaction = (wallet, tx) => {

         return cardano.transactionSign({
             signingKeys: [wallet.payment.skey, wallet.payment.skey ],
             txBody: tx
         })
     }

     const signed = signTransaction(wallet, raw)
     console.log("SIGNED=>",signed);
     // 10. Submit transaction

     const txHash = cardano.transactionSubmit(signed)

     res.json({"message":"Transaction Submitted","txHash":txHash});

}

nftController.send=async(req,res)=>{
    const sender= cardano.wallet("ADA");
    let receiverAddress=req.body.receiverAddress;
    let asset= req.body.assetId;
    let obj={};
   
    
    
    const txInfo = {
        txIn: cardano.queryUtxo(sender.paymentAddr),
        txOut: [
          {
            address: sender.paymentAddr,
            value: {
              lovelace: sender.balance().value.lovelace - cardano.toLovelace(1.6),
            },
          },
          {
            address: receiverAddress,

            value: {
              lovelace: cardano.toLovelace(1.6),
              [asset]:1
            },
          },
        ],
      };
    console.log(txInfo.txOut);

    const raw = cardano.transactionBuildRaw(txInfo);

    const fee = cardano.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1,
    });

    //pay the fee by subtracting it from the sender utxo
    txInfo.txOut[0].value.lovelace -= fee;

    //create final transaction
    const tx = cardano.transactionBuildRaw({ ...txInfo, fee });

    //sign the transaction
    const txSigned = cardano.transactionSign({
        txBody: tx,
        signingKeys: [sender.payment.skey],
    });

    //submit transaction
    const txHash = cardano.transactionSubmit(txSigned);
    res.json({"message":"Transfer Transaction Submitted","txHash":txHash});


}


module.exports = nftController;