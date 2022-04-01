const walletController={};
const cardano = require('../services/cardano');


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


walletController.post=async(req,res)=>{
    const sender=createWallet("ADA");
    res.json({"message":"Wallet Created send Ada","Address":sender.paymentAddr});

}

walletController.get=async(req,res)=>{

    const wallet= cardano.wallet("ADA");
    res.json(wallet.balance());
}



module.exports =walletController;