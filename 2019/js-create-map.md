---
title: Create Map in JavaScript
author: Zheng Yuan
date: 10/20/2019
tags: ['vanilla js', 'js', 'data structure', 'native api']
---

Create Map in JavaScript
============

After `Object.create` introduced in **ES5**, we can quickly create a object without any prototype by calling 
~~~javascript
var obj = Object.create(null);

> obj.__proto__
undefined
~~~

by doing so, we don't need to worry about our object data will be influenced by the properties and methods of the native object since it doesn't inherit from that.

A lot of developers begin to use this clean object to do a simple mapping createion. 

~~~javascript
var cleanMap = Object.create(null);
var dirtyMap = {};

> cleanMap['hasOwnProperty']
undefined // correct since we never set this key before

> dirtyMap['hasOwnProperty']
[Function: hasOwnProperty] // Oops, we were trapped by the native object property API
~~~

Which one should I choose?
-------

After **ES6** introduced the standard built-in object `Map`, in most time will take this one as our first choice because of its methods that are easy to understand (*unless we need to consider the old browsers (like **IE**) that don't fully compatible with this structure*).

So the main factor that determine us which one to use is the performance, so I just run a [jsperf test cases](https://jsperf.com/js-map-compare) to have a benchmark for the read/write performance testing, and the result is:

Test case | Ops/sec
----------| --------
`{}`   | 2,677 (±15.13% 13% slower)
`Map` | 893 (±0.91% 67% slower)
`Object.create(null)` | 2,999 (±12.79% fastest)

As for the memory usage, we use chrome memory profiler to take a snapshot of each testing case:

Here is the testing snippet (comment out all r/w in base line profiling)
~~~javascript
// This is the memory usage testing only
// for time performance: https://jsperf.com/js-map-compare

const arr = [];
for(let i = 0; i < 1000; i++) {
    // const map = {};
    // const map = Object.create(null);
    // const map = new Map();
    for(let j = 0; j < 100; j++){
        // map[j] = [j];
        // map[j] = [j];
        // map.set(j, j);
    }
    // arr.push(map)
}
~~~

Test case | total memory useage
----------| --------
**Base line** | 2.1 MB
`{}`   | 9.0 MB
`Map` | **6.0 MB** (smallest)
`Object.create(null)` | 9.1 MB

As we can see there is a significant memory usage difference between `Map` and `Object.create(null)/{}`, which is a trade-off with the time performance if we combine the previous result.

Summary
----------
Test case | total memory useage | Ops/sec
----------| -------- | --------
**Base line** | 2.1 MB | -
`{}`   | 9.0 MB | 2,677 (±15.13% 13% slower)
`Map` | **6.0 MB (smallest)** | 893 (±0.91% 67% slower)
`Object.create(null)` | 9.1 MB | **2,999 (±12.79% fastest)**

As we can see, there is no a best choice unless you decide to take **time performance**/**memory usage** as first consideration, and IMHO, I prefer to use `Object.create(null)`, not only its compatibility with old browsers but also the fastest performance, as for the memory usage, we will put it in a low priority since we hardly have chance to handle enormous quantity of mapping.
