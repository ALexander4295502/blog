---
title: JS design pattern - Observer Pattern II
author: Zheng Yuan
date: 11/09/2019
tags: ['vanilla js', 'js', 'design pattern', 'observer', 'excerpt']
---

JS design pattern - Observer Pattern II
============

In the previous section, we covered how to create the observer class and related methods. Next step we need to model the `Subject` and the ability to add, remove or notify observers on the observer list.

~~~javascript
function Subject() {
    this.observers = new ObserverList();
}

Subject.prototype.AddObserver = function(observer) {
    this.observers.add(observer);
};

Subject.prototype.RemoveObserver = function(observer) {
    this.observers.RemoveAt(this.observers.indexOf(observer, 0));
};

Subject.prototype.Notify = function(context) {
    var observerCount = this.observers.count();
    for(var i = 0; i < observerCount; i++) {
        this.observers.Get(i).Update(context);
    }
};
~~~

We then define a skeleton for creating new Observers. The `Update` functionality here will be overwritten latter with custom behavior.
~~~javascript
// The Observer
function Observer() {
    this.Update = function() {
        // new update logic goes here...
    }
}
~~~

In our sample application using the above Observer components, we now define: 
* A button for adding new observable checkboxes to the page
* A control checkbox, which will act as a subject, notifying other checkboxes they should be checked
* A container for the new checkboxes being added to the page
* A control checkbox, which will act as a subject notifying other checkboxes they should be checked
* A container for the new checkboxes they should be checked
* A container for the new checkboxes being added

We then define `ConcreteSubject` and `ConcreteObserver` handlers for both adding new observers to the page and implementing the updating interface. See below for inline comments on what these components do in the context for our example.

Here is the HTML code:
~~~html
<button id="addNewObserver">
    Add New Observer checkbox
</button>

<input id="mainCheckbox" type="checkbox"/>
<div id="observersContainer"></div>
~~~

Here is a sample script:
~~~javascript
// References to our DOM elements
var controlCheckbox = document.getElementById('mainCheckbox');
var addBtn = document.getElementById('addNewObserver');
var container = document.getElementById('observersContainer');

// Concrete Subject
// Extend the controlling checkbox with the subject class
extend(new Subject(), controlCheckbox);

// Clicking the checkbox will trigger notifications to its observers
controlCheckbox.onclick = function(e) {
    controlCheckbox.Notify(e.target.checked);
}

addBtn.onclick = AddNewObserver;

// Concrete Observer
function AddNewObserver() {
    // Create a new checkbox to be added
    var check = document.createElement('input');
    check.type = 'checkbox';

    // Extend this checkobx with Observer class 
    extend(new Observer(), check);

    // Override with custom update behavior
    check.Update = function (value) {
        this.checked = value;
    }

    // Add the new observer to our list of observers
    // for our main subject
    controlCheckbox.AddObserver(check);

    // Append the item to the container
    container.appendChild(check);
}
~~~

In this example, we looked at how to implement and utilize the observer pattern, convering the concepts of a `Subject`, `Observer`, `ConcreteSubject` and `ConcreteObserver`.
