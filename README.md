halfexpired-lru
===============

lru-cache where get accepts an optional "fill" callback.
A fill callback would be used to populate a value in the background before it is really expired.
set also supports ttl per key.

example
=======

```js

var cache = require('halfexpired-lru');

cache.set('a',1);

cache.get('a',function(err,key,value,ttl,remaining){
  if(err == 'halfexpired') {
    request(url,function(err,data){
      if(err) {
	// if i set it halfexpired will hit next in half the remaining time.
	cache.set(key,value,remaining);
	console.log('that flakey api failed again! good thing my value is not completely expired ;)');
      } else cache.set(key,value,ttl);
    })
  }
});

```
