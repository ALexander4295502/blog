---
title: JS design pattern - singleton pattern
author: Zheng Yuan
date: 10/26/2019
tags: ['vanilla js', 'js', 'design pattern', 'singleton', 'excerpt']
---

JS design pattern - singleton pattern
============
The singleton pattern is thus known because it restricts instantiation of a calss to a single object.

Classically, the singleton pattern can be implemented by creating a class with a method that creates a new instance of the class if one doesn't exist. In the event of an instance already existing, it simply returns a reference to that object. 

In the JavaScript, singletons serve as a shared resource namespace which isolate implementation code from the global namespace.


Implementation
-----

we can implement a singleton as follows:

~~~javascript
var mySingleton = (function () {
    // Instance stores a reference to the singleton
    var instance;

    function init() {
        // Singleton
        // Private methods and variables 
        function privateMethod() {
            console.log("I am private");
        }

        var privateVariable = "I'm also private";

        return {
            publicMethod: function() {
                privateMethod();
            },
            publicProperty: privateVariable
        };
    }

    return {
        getInstance: function() {
            if(!instance) {
                instance = init();
            }
            return instance;
        }
    }
});

// Usage
var singleA = mySingleton.getInstance();
var singleB = mySingleton.getInstance();
console.log(singleA === singleB); // true
~~~

Applicability of the singleton
--------

In the **GoF book**, the applicability of the singleton pattern is described as follows:

* there must be exactly one instance of a class, and it must be accessible to clients from a well-known access point.
* The sole instance should be extensible by the subclassing, and clients should be able to use an extended instance without modifying their code.

The second of these points refer to a case we might need such as:

~~~javascript
mySingleton.getInstance = function() {
    if(this._instance === null) {
        if(isFoo()) {
            this._instance = new FooSingleton();
        } else {
            this._instance = new BarSingleton();
        }
    }
    return this._instance;
}
~~~

Here, `getInstance` becomes a little like a factory method and we don't need to update each point in our code when accessing it.

Do we really need singleton in our code?
----------
While the singleton has valid uses, often when we find ourselves needing it in JavaScript, it's a sign that we may need to reevaluate our design.

The presense of the Singleton is often an indication that modules in a system are either tightly coupled or that logic is overly spread across multiple parts.

For more details see [Use your singletons wisely](https://www.ibm.com/developerworks/webservices/library/co-single/index.html) written by *J.B. Rainsberger* and [Dependency Injection Myth: Reference Passing](http://misko.hevery.com/2008/10/21/dependency-injection-myth-reference-passing/) written by *Miško Hevery*