const ipfsController = {};
const FormData = require('form-data');
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
const fs = require('fs');




ipfsController.post=async(req,res)=>{
    const form = new FormData();
    form.append('file',fs.createReadStream(`./${req.file.path}`));

    
    ipfs.util.addFromFs(`./${req.file.path}`, {recursive:true}, (err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data);
    })


}

ipfsController.get=async(req,res)=>{
    
    ipfs.cat(req.query.hash, (err, outStream)=>{
        if(err) throw err;
        

        res.send(outStream);

    })
    
    
}


module.exports =ipfsController;