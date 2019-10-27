---
title: JS design pattern - Observer Pattern I
author: Zheng Yuan
date: 10/27/2019
tags: ['vanilla js', 'js', 'design pattern', 'observer', 'excerpt']
---

JS design pattern - Observer Pattern I
============

The Observer is a design pattern in which an object (known as a subject) maintains a list of objects depending on it(observers), automatically notifying them of any changes to state.

When a subject needs to notify observers about something interseting happening, it broadcasts a notification to the observers(which can include specific data related to the topic of the notification).

When we no longer wish for a particular observer to be notified of changes by the subject it is registered with, the subject can remove it from the list of observers.

It's often useful to refer back to published definition of design patterns that are language agnostic to get a broader sense of their usage and advantages over time.

The definition of the Observer pattern providede in the **GoF Book** is:
> One or more observers are interested in the state of a subject and register their interest with the subject attaching themselves. When something changes in our subject that the observer may be interested in, a notify message is sent which calls the update method in each observe. When the observer is no longer interested in the subject's state, they can simply detach themselves from the subject.

We can now expand on what we've learned to implement the Observer pattern with the following components:

1. **Subject**: Maintains a list of *observers*, facilitates adding or removing *observers*

2. **Observer**: Provides an update interface for objects that need to be notified of a *Subject*'s changes of state

3. **ConcreteSubject**: Broadcasts notifications to *Observers* on changes of state, stores the state of *ConcreteObservers*

4. **ConcreteObserver**: Stores a reference to the *ConcreteSubject*, implements an update interface for the *Observer* to ensure state is consistent with the *Subject*'s

Implementation
----------

To have a better understanding of the observer pattern, first, let's model the list of dependent Observers a subject may have:

~~~javascript
function ObserverList() {
    this.observerList = [];
}

ObserverList.prototype.Add = function (obj) {
    return this.observerList.push(obj);
}

ObserverList.prototype.Empty = function () {
    this.observerList = [];
}

ObserverList.prototype.Count = function () {
    return this.observerList.length;
}

ObserverList.prototype.Get = function (index) {
    if(index > -1 && index < this.observerList.length) {
        return this.observerList[index];
    }
}

Observer.prototype.Insert = function (obj, index) {
    var pointer = -1;
    if (index === 0) {
        this.observerList.unshift(obj);
        pointer = index;
    } else if (index === this.observerList.length) {
        this.observerList.push(obj);
        pointer = index;
    } else {
        this.observerList.splice(index, 0, obj);
        pointer = index;
    }

    return pointer;
}

ObserverList.prototype.IndexOf = function(obj, startIndex) {
    var i = startIndex, pointer = -1;
    while(i < this.observerList.length) {
        if(this.observerList[i] === obj) {
            pointer = i;
            break;
        } else {
            i += 1;
        }
    }
    return pointer;
}

ObserverList.prototype.RemoveIndexAt = function(index) {
    if(index <= 0) {
        this.observerList.shift()
    } else if (index >= this.observerList.length - 1) {
        this.observerList.pop();
    } else {
        this.observerList.splice(index, 1);
    }
}

// Extend an object with an extension
function extend(extension, obj) {
    for(var key in extension) {
        obj[key] = extension[key];
    }
}
~~~
