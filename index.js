var LRU = require('lru-cache');


module.exports = function(options){
  var cache = LRU(options);
  return {
    lru:cache,
    get:function(k,fill){
      var z = this;
      var data = this.lru.get(k);
      if(data == undefined || !data.t) {
        if(fill) process.nextTick(function(){
            fill.call(z,null,k);
        });
        return;
      }
      
      var v = data.v
      ,exp = data.t+data.exp
      ,halfExp = data.t+(data.exp/2)// todo - make this configurable.
      ,error
      ;

      if(exp < this.time()) {
        error = 'expired';
        this.lru.del(k);
        v = undefined;
      } else if(halfExp < this.time() && !data.halfexpired) {
        error = 'halfexpired';
        // only fire half expired once per key per set.
        if(fill) data.halfexpired = true;
      }
        
      if(fill) {
        process.nextTick(function(){
          fill.call(z,error,k,v,data.e,exp-z.time());
        });
      }

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
