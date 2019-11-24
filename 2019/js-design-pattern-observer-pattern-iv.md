---
title: JS design pattern - Observer Pattern IV
author: Zheng Yuan
date: 11/24/2019
tags: ['vanilla js', 'js', 'design pattern', 'observer', 'excerpt']
---

JS design pattern - Observer Pattern IV
============

Publish/Subscribe Implementations
----------

Publish/Subscribe fits in very well in JavaScript ecosystems, largely because at the core, ECMAScript implementations are event driven. This is particularly true in browser environments, as the DOM uses events as its main interaction API for scripting.

That said, neither ECMAScript nor DOM provide core objects or methods for creating custom events systems in implementaion code(with the exception of perhaps the DOM3 CustomEvent, which is bound to the DOM and is thus not generically useful)

Here is a simple Publish/Subscribe implementation:
~~~javascript
var pubsub = {};
(function(q) {
    var topics = {},
        subUid = -1;

    // Publish or broadcast events of interest 
    // with a specific topic name and arguments 
    // such as the data to pass along
    q.publish = function(topic, args) {
        if(!topics[topic]) {
            return false;
        }

        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;

        while(len -= 1) {
            subscribers[len].func(topic ,args);
        }

        return this;
    }

    // Subscribe to events of interest with specific topic name
    // and a callback funtion, to be executed 
    // when the topic/event is obeserved
    q.subscribe = function(topic, func) {
        if(!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++subUid).toString();
        topics[topic].push({
            token: token, 
            func: func
        });
        return token;
    }

    // Unsubscribe from a specific 
    // topic, based on a tokenized reference
    // to the subscription
    q.unsubscribe = function(token) {
        for(var m in topics) {
            if(topics[m]) {
                // use j to record the topics length to avoid repeat query
                for(var i == 0, j = topics[m].length; i < j; i++) {
                    if(topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return this;
    }
})(pubsub)
~~~

We can now use the implementation to publish and subscribe to events of interest as follows:

~~~javascript
var messageLogger = function(topics, data) {
    console.log("Logging: " + topics + ": " + data);
};

var subscription = pubsub.subscribe("inbox/newMessage", messageHandler);

pubsub.publish("inbox/newMessage", "hello world!");
~~~

Decoupling an Ajax-based jQuery application
-----------

In our final example, we're going to take a pratical look at how decoupling our code using Pub/Sub early on in the development process can save us some potentially painful refactoring later on.

Quite often in Ajax-heavy applications, once we've received a response to a request, we want to achieve more than just one unique acion. We could simple add all of the post-request logic into a success callback, but there are drawbacks to this approach.

Highly coupled applications sometimes increase the effort required to reuse funcionality due to the increased inter-function/code dependency. 

Use Observers, we can also easily separate application-wide notifications regarding different events down to whatever level of granularity we're comfortable with.
