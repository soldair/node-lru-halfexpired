var LRU = require('lru-cache');


module.exports = function(options){
  var cache = LRU(options);
  return {
    lru:cache,
    get:function(k,fill){
      var data = this.lru.get(k);
      if(data == undefined || !data.t) {
        if(fill) fill.call(this,null,k);
        return;
      }
      
      var v = data.v
      ,exp = data.t+data.exp
      ,halfExp = data.t+(data.exp/2)
      ,error
      ;

      if(exp < this.time()) {
        error = 'expired';
        this.lru.del(k);
        v = undefined;
      } else if(halfExp < this.time()) {
        error = 'halfexpired';
      }
        
      if(fill) fill.call(this,error,k,v,data.e);
      if(error != 'expired') return v;
      
    },
    set:function(k,value,exp){
      value = {t:this.time(),v:value,exp:exp||options.maxAge||1000*60*60*24};
      return this.lru.set(k,value);
    },
    del:function(k){
      return this.lru.del(k);  
    },
    reset:function(){
      this.lru.reset();    
    },
    time:function(){
      return Date.now();
    }
  };
};
