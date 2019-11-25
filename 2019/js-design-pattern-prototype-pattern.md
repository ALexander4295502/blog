---
title: JS design pattern - Prototype pattern
author: Zheng Yuan
date: 11/24/2019
tags: ['vanilla js', 'js', 'design pattern', 'prototype', 'excerpt']
---

JS design pattern - Mediator pattern
============

The GoF refers to the Prototype pattern as one that creates objects based on a template of an existing object through cloning.

We can think of the Prototype pattern as being based on prototypal inheritance in which we create objects that act as prototypes for other objects.

The `prototype` object itself is effectively used as a blueprint for each object the constructor creates. If the prototype of the constructor function used contains property called name, then each object created by that same constructor will also have this same property.

The reality is that prototypal inheritance avoids using classes altogether. There isn't a "definition" object nor a core object in theory; we're simply creating copies of exsiting funcional objects.

One of the benefits of using the Prototype pattern is that we've working with the prototypal strengths JavaScript has to offer natively rather than attempting to imitate features of other languages. 

Not only is the pattern an easy way to implement inheritance, but it can come with performance boost as well: when defining functions in an object, they're all created by reference(so all child objects point to the same function), instead of creating their own individual copies.

For those interested, real prototypal inheritance as defined in the ECMAScript 5 standard, requires the use of `Object.create`. To review, `Object.create` creates an object that has a specified prototype and optionally contains specified properties as well (e.g., `Object.create(prototype, optionalDescriptorObjects)`).

We can see this demonstrated in the following example:
~~~javascript
var myCar = {
    name: "Ford Escort",
    drive: function() {
        console.log("I'm driving!");
    }
}

var yourCar = Object.create(myCar);
console.log(yourCar.name); 
// -> Ford Escort
~~~

`Object.create` also allows you to easily implement advanced concepts such as differential inheritance in which objects are able to directly inherit from other objects. For example:
~~~javascript
var vehicle = {
    getModel: function() {
        console.log("The model of this vehicle is " + this.model);
    }
};

var car = Object.create(vehicle, {
    id: {
        value: 'uniqueId', 
        // writable: false, configurable: false 
        // by default
        enumerable: true
    }, 
    model: {
        value: 'Ford', 
        enumerable: true
    }
});
~~~

Here, the properties can be initilized on the second argument of `Object.create` using an object literal with a syntax similar to that used by the `Object.defineProperties` and `Object.defineProperty` methods.

It is worth noting that prototypal relationships can cause trouble when enumerating properties of objects and wrapping the contents of the loop in a `hasOwnProperty()` check, if we wish to implement the Prototype pattern without direcly using `Object.create`. 

~~~javascript
Object.keys(car);
// > [ 'id', 'model' ]

for(var prop in car) {
    console.log(prop);
}
// > id
// > model
// > getModel

// the result is different since for .. in also iterates over inherited enumerable properties
// so you might need to use hasOwnProperty to filter the prototype properties.
// while Object.keys() only iterates over own enumerable properties
~~~

we can simulate the pattern as per the above example as follows:
~~~javascript
var vehiclePrototype = {
    init: function(carModel) {
        this.model = carModel;
    }, 
    getModel: function() {
        console.log("The model of this vehicle is " + this.model);
    }
}

function vehicle(model) {
    function F() {}
    F.prototype = vehiclePrototype;
    var f = new F();
    f.init(model);
    return f;
}
~~~

> Note: this alternative does not allow the user to define read-only properties in the same manner(as the `vehiclePrototype` may be altered if not careful)

A final alternative implementation of the Prototype pattern could be the following:

~~~javascript
var beget = (function() {
    function F() {};
    return function(proto) {
        F.prototype = proto;
        return new F();
    };
})()
~~~

One could reference this method from the `vehicle` function. Note, however that `vehicle` here is emulating a constructor, since the Prototype pattern does not include any notion of initialization beyond linking an onject to a prototype.
