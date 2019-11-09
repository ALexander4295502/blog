---
title: JS design pattern - Observer Pattern II
author: Zheng Yuan
date: 11/09/2019
tags: ['vanilla js', 'js', 'design pattern', 'observer', 'excerpt']
---

JS design pattern - Observer Pattern III
============

Difference between the `Observer` and `Publish`/`Subscribe` Pattern
---------

While the Observer pattern is useful to be aware of, quite often in the JavaScript world, we'll find it commonlu implemented using a vairation known as the `Publish`/`Subscribe` pattern. While very similar, there are differences between these patterns worth noting.

The Observer pattern requires that the observer(or object) wishing to receive topic notifications must subscribe this interest to the oject firing the event(subject).

> One thing I need to mention is that if you are using some third-party libraries that implement the observer pattern like **RxJS**, you might notice that they use term `Observer` and `Subject` to refer the `Observable` object and the only difference between them is that `Subject` can broadcasts while `Observer` is unicast.

The `Publish`/`Subscribe` pattern however uses a topic/event channel that sits between the objects wishing to receive notifications(subscriber) and the objects firing the event(the publisher). This event system allows code to define application specific events that can pass suctom arguments containing values neede by the subscriber. The idea here is to avoid dependencies between the subscriber and the publisher.

This differs from the Observer pattern ass it allows any subscriber implementing an appropriate event handler to register for and receive topic notifications broadcasts by the publisher.

Here is an example of how one might use the Publish/Subscribe pattern if provided with functional implementation powering `publish()`, `subscribe()`, and `unsubscribe()` behind the scenes.

~~~javascript
// A very simple new mail handler

// A count of the number of messages received
var mailCounter = 0;

// Initialize subscriber that will listen out for a topic with name "inbox/newMessage"

// Render a preview of new messages
var subscriber1 = subscribe("inbox/newMessage", function(topic, data) {
    // Log the topic for debugging purposes
    console.log("A new message was received: ", topic);

    // Use the data that was passed from our subject to display a message preview to the user
    $(".messageSender").html(data.sender);
    $(".messagePreview").html(data.body);
});

// Here's another subscriber using the same data to perform a different task 

// Update the counter displaying the number of new messages received via the publisher
var subscriber2 = subscribe("inbox/newMessage", function(topic, data) {
    $('.newMessageCOunter').html(mailCounter);
});

publish("inbox/newMessage", [{
    sneder: 'hellow@gmail.com',
    body: "Hey there! How are you doing today?"
}]);

// We could then at a later point unsubscribe our subscribers from receiving any new topic noticifications as follows:
// unsubscribe(subscriber1);
// unsubscribe(subscriber2);
~~~

The general idea here is the promotion of loose coupling. Rather than single object calling on the methods of other objects directly, they instead subscribe to a specific task or activity of another object and are notified when it occurs.

Advantages
-------

The `Observer` and `Publish`/`Subscribe` patterns encourage us to think hard about the relationships between different parts of our application. They also help us identify layers containing direct relationships that could be replaced with sets of subjects and observers. This effectively could be used to break down an application into smaller, more loosely coupled blocks to improve code management and potential for reuse.

Further motivation behind using the Observer pattern is where we need to maintaing consistency between related objects without making classes tightly coupled. For example, when an object needs to be abloe to notify other objects without making assumptions regarding those objects. 

This Dynamic relationships can exist between observers and subjects when using either pattern. This provides a great deal of flexibility that may not be as easy to implement when disparate parts of our application are tightly coupled.

While it may not always be the best solution to every problem, these patterns remain one of the best tools for designing decoupled systems and should be considered an important tool in any JavaScript developer's utility belt.

Disadvantages
-----------

Consequently, some of the issues with these patterns actually stem form their main benefit. In `Publish`/`Subscribe`, by decoupling publishers from subscribers, it can sometimes become difficult to obtain guarantees that particular parts of our applications are functioning as we may expect.

For example, publishers may make an assumption that one or more subscribers are listening to them. Say that we're using such an assumption to log or output errors regarding some application process. If the subscriber performing the logging crashes (or for some reason fails to function), the publisher won't have a way of seeing this due to the decoupled nature of the system.

Another drawback of the pattern is that subscribers are quite ignorant to the existing of each other and are blind to the cost of swithing publisher. Due to the dynamic relationships between subscribers and publishers, the update dependency can be difficult to track.