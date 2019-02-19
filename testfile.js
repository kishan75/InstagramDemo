var promise= new Promise(function(resolve,reject){
    reject();
    resolve();
});
promise.then(function(){
    console.log("resolve");
},function(){
    console.log("reject");
});