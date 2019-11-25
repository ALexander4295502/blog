---
title: JS design pattern - Mediator pattern
author: Zheng Yuan
date: 11/24/2019
tags: ['vanilla js', 'js', 'design pattern', 'mediator', 'excerpt']
---

JS design pattern - Mediator pattern
============

A mediator is a behavioral design pattern that allows us to expose a unified interface through which the different parts of a system may communicate.

If it appears a system has too many direct relationships between components, it may be time to have a central point of control that components communicate through instead. The Mediator pattern promotes losse coupling by ensuring that instead of components referring to each other explicitly, their interaction is handled through this central point. This can help us decouple systems and improve the potential for component reusability.

In implementation terms, the Mediator pattern is essentially shared subject in the Observer pattern. This might assume that a direcion Publish/Subscribe relationship between objects or modules in such system is sacrificed in order to maintain a central point of contact

An analogy would be DOM event bubbling and event delegation. If all subscriptions in a system are made against the document rather than individual nodes, the document effectively serves as a mediator. Instead of binding to the events of the individual nodes, a higher level object is given the reponsibility of notifying subscribers about interaction events.

Basic Implementation
----------------

A simple implementation of the Mediator pattern can be found below, exposing both `publish()` and `subscribe()` methods for use:

~~~javascript
var mediator = (function() {
    // Storage for topics that can be broadcast or listened to
    var topics = {};

    // Subscribe to a topic, supply a callback to be executed
    // when that topic is broadcast to
    var subscribe = function(topic, fn) {
        if(!topics[topic]) {
            topics[topic] = [];
        }

        topics[topic].push({context: this, callback: fn});

        return this;
    };

    // Publish/broadcast an event to the rest of the application
    var publish = function(topic) {
        var args;

        if(!topics[topic]) {
            return false;
        }

        args = Array.prototype.slice.call(arguments, 1);
        for(var i = 0, lenght = topics[topic].length; i < lenght; i++) {
            var subscription = topics[topic][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    }

    return {
        publish: publish,
        subscribe: subscribe,
        installTo: function(obj) {
            obj.subscribe = subscribe;
            obj.publish = publish;
        }
    };
});
~~~

Advanced Implementation
------------------------

To start, let's implement the notion of a subscriber, which we can consider an instance of a Mediator's topic registration.

By generating object instances, we can easily update subscribers later without need to unregister and re-register them. Subscribers can be written as constructors that take a function `fn` to be called, an `options` object and a `context` 

~~~javascript
// Pass in a context to attach out Mediator to.
// By default this will be the window object
(function(root) {
    function guidGenerator() { /* .. */ }

    // Our Subscriber constructor
    function Subscriber(fn, options, context) {
        if(!(this instanceof Subscriber)) {
            return new Subscriber(fn, context, options);
        } else {
            // guidGenerator() is a function that generates 
            // GUIDs for instances of our Mediators, Subscribers
            // so we can easily reference them later on. 
            // we're going to skip its implementation for brevity.
            this.id = guidGenerator();
            this.fn = fn;
            this.options = options;
            this.context = context;
            this.topic = null;

        }
    }
})();
~~~

Topics in our Mediator hold a list of callbacks and subtopics that are fired when `Mediator.Publish` is called on our Mediator instance. It also contains methods for manipulating lists of data.
~~~javascript
function Topic(namespace) {
    if(!(this instanceof Topic)) {
        return new Topic(namespace);
    } else {
        this.namespace = namespace || "";
        this._callbacks = [];
        this._topics = [];
        this.stopped = false;
    }
}

// Defined the prototype for our topic,
// including ways to add new subscribers or retrieve existing ones
Topic.prototype = {
    // Here stop propagation means 'stop capturing'
    StopPropagation: function() {
        this.stopped = true;
    }, 
    AddSubscriber: function(fn, options, context) {
        var callback = new Subscriber(fn, options, context);
        this._callbacks.push(callback);
        callback.topic = this;
        return callback;
    },
    GetSubscriber: function(identifier) {
        for(var x = 0, length = this._callbacks.length; x < length; x++) {
            if(this._callbacks[x].id === identifier || this._callbacks[x].fn === identifier) {
                return this._callbacks[x];
            }
        }

        for(var z in this._topics) {
            if(this._topics.hasOwnProperty(z)) {
                var sub = this._topics[z].GetSubscriber(identifier);
                if(sub !== undefined) {
                    return sub;
                }
            }
        }
    },
    RemoveSubscriber: function(identifier) {
        if(!identifier) {
            this._callbacks = [];
            for(var z in this._topics) {
                if(this._topics.hasOwnProperty(z)) {
                    this._topics[z].RemoveSubscriber(identifier);
                }
            }
        }

        for(var y = 0, len = this._callbacks.length; y < len; y++) {
            if(this._callbacks[y].fn === identifier || this._callbacks[y].id === identifier) {
                this._callbacks[y].topic = null;
                this._callbacks.splice(y, 1);
                y -= 1;
                len -= 1;
            }
        }
    },
    AddTopic: function(topic) {
        this._topics[topic] = new Topic((this.namespace ? this.namespace + ":" : "") + topic);
    },
    HasTopic: function(topic) {
        return this._topics.hasOwnProperty(topic);
    }, 
    ReturnTopic: function(topic) {
        return this._topics[topic];
    }, 
    Publish: function(data) {
        for(var y = 0, len < this._callbacks.length; y < len; y++) {
            this._callbacks[y].fn.apply(callback.context, data);
        }
        
        if(!this.stopped) {
            for(var topic in this._topics) {
                // This way you're guaranteed only the keys that are on that object instance itself.
                if(this._topics.hasOwnProperty(topic)) {
                    this._topics[topic].Publish(data);
                }
            }
        }

        this.stopped = false;
    }
}
~~~

Here we expose the `Mediator` instance we will primarily be interacting with. It is though here that events are registered and removed from topics.

~~~javascript
function Mediator() {
    if(!(this instanceof Mediator)) {
        return new Mediator();
    } else {
        this._topics = new Topic();
    }
}

Mediator.prototype = {
    GetTopic: function(namespace) {
        var topic = this._topics,
            namespaceHierarchy = namespace.split(':');

        if(namespace === '') {
            return topic;
        } 
        if (namespaceHierarchy.length > 0) {
            for(var i = 0; len < namespaceHierarchy.length; i++) {
                if(!topic.HasTopic(namespaceHierarchy[i])) {
                    topic.AddTopic(namespaceHierarchy[i]);
                    topic = topic.ReturnTopic(namespaceHierarchy[i]);
                }
            }
        }

        return topic;
    }, 
    Subscribe: function(topicName, fn, options) {
        var options = options || {},
            context = context || {},
            topic = this.GetTopic(topicName),
            sub = topic.AddSubscriber(fn, options, context);
        
        return sub;
    }, 
    GetSubscriber: function(identifier, topic) {
        return this.GetTopic(topic || "").GetSubscriber(identifier);
    }, 
    RemoveSubscriber: function(topicName, identifier) {
        this.GetTopic(topicName).RemoveSubscriber(identifier);
    }, 
    Publish: function(topicName) {
        var args = Array.prototype.slice.call(arguments, 1),
            topic = this.GetTopic(topicName);
        
        args.push(topic);
        topic.Publish(args);
    }
}
~~~

Finnaly we can easily expose our Mediator for attachment to the object passed in to root:

~~~javascript
(function(root) {
    root.Mediator = new Mediator();
})(window);
~~~

Advantages and Disadvantages
------------------------

The largest benefit of the Mediator Pattern is that it reduces the communication channels needed between objects or components in a system from many to many to just many to one. Adding new publishers and subscribers is relatively easy due to the level of decoupling present.

Perhaps the biggest downside of using the pattern is that it can introduce a single point of failure.

Placing a Mediator between modules can cause a performance hit as they are always communicating indirectly. Because of the nature of loose coupling, it's difficult to establish how a system might react by only looking at the broadcast.

That said, it's useful to remind ourselves that decoupled systems have a number of other benefits: if our modules communicated with each other directly, changes to modules could easily have a domino effect on the rest of our application. This problem is less of a concern with decoupled systems.
