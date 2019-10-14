---
title: JS design pattern - module pattern
author: Zheng Yuan
date: 10/01/2019
tags: ['vanilla js', 'js', 'design pattern', 'module', 'excerpt']
---

JS design pattern - module pattern
============

In javascript, there aer several different options for implementing modules. These includes:

* Object literal notation
* The Module pattern
* AMD modules
* CommonJS modules
* ECMAScript Harmony modules

Object Literals
----

In object literal notation, an object is described as a set of comma-separated **name/value** pairs enclosed in `({})`, you can add property using assignment `myModole.property = 'value'`.

~~~javascript
// a module defined using object literal notation
var myModole = {
    somePrperty: "someValue",

    // object literals can contain properties and methods.
    // e.g we can define a further object for module configuration
    myConfig: {
        useCaching: true,
        languages: 'en'
    },

    functionKey: function() {
        // ...
    }
};

// call the methods defined in module
myModole.functionKey();
~~~

And here is a more detailed example of object literals module:
~~~javascript
var myFeature = {
    config : {
        wrapper : '#myFeature',
        container : 'div',
        urlBase : 'foo.php?item='
    },

    init : function(config) {
        $.extend(myFeature.config, config);
        $(myFeature.config.wrapper).find('li').
            each(function() {
                myFeature.getContent($(this));
            }).
            click(function() {
                myFeature.showContent($(this));
            });
    },

    buildUrl : function($li) {
        return myFeature.config.urlBase + $li.attr('id');
    },

    getContent : function($li) {
        $li.append(myFeature.config.container);
        var url = myFeature.buildUrl($li);
        $li.find(myFeature.config.container).load(url);
    },

    showContent : function($li) {
        $li.find('div').show();
        myFeature.hideContent($li.siblings());
    },

    hideContent : function($elements) {
        $elements.find('div').hide();
    }
};

$(document).ready(function() { myFeature.init(); });
~~~

What can the object literal bring us? in the **Rebecca Murphey**'s article there is a brief conclusion:
> By using an object literal, we’ve broken our code into its logical parts, making it easy to locate the things we might want to change down the road. We’ve made our feature extendable, by providing the ability to pass in overrides to the default configuration. 

Module Pattern
----

the module pattern was originally defined as a way to provide both private and public encapsulation for classes in conventional software engineering.

In JavaScript, the Module pattern is used to further *emulate* the concept of classes in such a way that we're able to include both **public** and **private** methods an variables inside a single object(sheilding them from global scope).

This pattern is quite similar to **IIFE**(known as immediately-invoked functional expression), except that an object is returned rather than a function.

Here is an simple example:
~~~javascript
var myNamespace = (function() {
    var myPrivateVar = 0;

    var myPrivateMethod = function() {
        console.log(myPrivateVar);
    };

    return {
        myPublicVar: 'foo',
        myPublicMethod: function() {
            myPrivateMethod();
        }
    }
}());
~~~

There are a number of advantages to using this pattern:
* The freedom to have private functions that can only be consumed by our module. As they aren't exposed to the rest of the page(Only exported API is), they are considered truly private.
* It also enables us to return different functions depending on the environment.

### Module Pattern Variations
#### Import mixins 

This variation of the pattern demonstrates how globals(eg: `jQuery`, `Underscore`) can bepassed in the arguments to our modules anonymous function. This effectively allows us to import them and locally alisa them as we wish.

~~~javascript
// Global Module
var myModule = (function($, _) {
    function privateMethod() {
        $(".container").html(_.min([1, 2, 3]));
    }

    return {
        publicMethod: function() {
            privateMethod();
        }
    }
})(jQuery, _);
~~~

There are several toolkit and framework-specifc module pattern implementations like **Dojo**, **ExtJS**, **YUI**.

