var cache = require('./index')
, test = require('tap').test

test("test cache works",function(t){
  var c = cache({max:100});
  c.set('a',1,2);
  t.equals(c.get('a'),1,'get a should equal 1');
  var a = c.lru.get('a');
  t.ok(a.t <= Date.now(),'t key should be set properly in underlying lru cache');
  t.equals(a.exp,2,'exp key should be 2 in lru cache');
  t.equals(a.v,1,'v key should be set properly in lru cache');

  c.del('a');
  t.ok(!c.get('a'),'a deleted key should not be returned');

  c.set('a',1,2);
  c.reset();
  t.ok(!c.get('a'),"flush should delete all keys");
  t.end();
});

test("repopulate at half exp with fill api",function(t){ 

  var c = cache({max:100});
  var start = c._t = Date.now();
  
  c.time = function(){
    return this._t;
  }

  c.set('b',1,3);

  t.plan(7);

  // this is bad form. it looks non blocking but its blocking.
  c.get('b',function(err,k,v){
    t.ok(!err,'should not have error if item is not half expired');
    c._t += 2;
    var res = c.get('b',function(err,k,v){
      t.equals(err,'halfexpired','should get half expired error');
      c._t+=10;
      var res = c.get('b',function(err,k,v){
        t.equals(err,'expired')
        t.equals(k,'b','k should equal b');
        t.ok(!v,'should have no value because its expired');
      });

      t.equals(res,undefined,'key should be expired');
    });
    
    t.equals(res,1,'get should return result and still cal fill');
  });

  // see!
});

