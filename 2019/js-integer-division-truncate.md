---
title: How to do the integer division truncate
author: Zheng Yuan
date: 10/20/2019
tags: ['vanilla js', 'js', 'operator', 'native api']
---

How to do the integer division truncate
============

~~~javascript
var a = 55;
var b = 303575040;

> parseInt(a/b);
1 // --> Wrong :(

> ~~(a/b)
0 // correct :)
~~~

Why parseInt not always correct?
-------

First we need to know how `parseInt()` works. 

`parseInt()` has the following signature:
~~~javascript
parseInt(value, radix?)
~~~

It converts value to string, ignores leading whitespace and then parses as many consecutive integer digits as it can find.

If radix is missing then it is assumed to be 10 except if value begins with **0x** or **0X**, in which case radix is set to 16 (hexadecimal):
~~~javascript
> parseInt('0xA')
10

// which is same with:
> parseInt('0xA', 16)
10
~~~

Additionally, some engines set the radix to 8 if the integer starts with a **leading zero**:
~~~javascript
> parseInt('010')
8
> parseInt('0109')  // ignores digits ≥ 8
8
~~~

so why the previous result is incorrect by using `parseInt()` ?
Let's go thought the whole process step by step:

when you execute:
~~~javascript
parseInt(33/303575040);
~~~

it first result the division which make the input param like this:
~~~javascript
// 33 / 303575040 = 1.0870458915199352e-7
parseInt(1.0870458915199352e-7);
~~~

then the `parseInt()` convert the input to string:
~~~javascript
parseInt('1.0870458915199352e-7');
~~~

Since `parseInt()` doesn’t consider **e** to be an integer digit and thus stops parsing after the `1.0870458915199352` which results in:
~~~javascript
parseInt('1.0870458915199352');
// result is 1
~~~

Alternatives to `parseInt()`?
--------

you can use `Math.floor()` and `Math.ceil()` to achieve this (each of them handle the positive result and negative result respectively)

~~~javascript
> Math.floor(3.2)
3
> Math.floor(3.5)
3
> Math.floor(3.8)
3

> Math.ceil(-3.2)
-3
> Math.ceil(-3.5)
-3
> Math.ceil(-3.8)
-3
~~~

We can implement a simple function to finish the truncation by combining these two native functions:

~~~javascript
function toInteger(x) {
    x = Number(x);
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
~~~

More efficient way
-------

There is another **faster substitute** for `Math.floor()` and `Math.ceil()`: 

**Using the double Bitwise NOT - The `~` operator.**

Apart from "inverting the bits of its operand" bitwise NOT in JavaScript is actually very useful not only when it comes to binary. Firstly, it has a very interesting effect on integers - **it converts the integer to -(N+1) value** just like the `toInteger()` function we just implemented above:

~~~javascript
~~2 === toInteger(2); //true, 2
~~2.4 === toInteger(2.4); //true, 2
~~3.9 === toInteger(3.9); //true, 3
~~(-3.9) === toInteger(-3.9); //true, -3
~~~

And there is a [performance testing demo](https://jsperf.com/jsfvsbitnot), which can proof that `~~` has a better performance than the native Math functions:

\# | Browser       | Math.floor()    | Bitwise double NOT ~~
-- | ------------- | --------------- | ----------
#1 | Firefox 7.0.1 | 42ms	         | 29ms
#2 | Firefox 7.0.1 | 44ms	         | 28ms
#3 | Chrome 15	   | 63ms	         | 64ms
#4 | Chrome 15	   | 63ms	         | 68ms
#5 | IE8           | 265ms	         | 192ms
#6 | IE8           | 324ms	         | 190ms