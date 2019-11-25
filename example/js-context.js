var myObj = {
    fn: function() {

        // When a function is called as a method of an object, its this is set to the object the method is called on.
        console.log('fn scope:', this);

        // In sloppy mode, because the value of this is not set by the call, this will default to the global object, which is window in a browser. 
        var fnExpr = function() {
            console.log('fnExpr scope: ', this);
        }
        function fnDeclare() {
            console.log('fnDeclare scope: ', this);
        }

        // In strict mode, however, if the value of this is not set when entering an execution context, 
        // it remains as undefined, as shown in the following example:
        // To set the value of this to a particular value when calling a function, use call(), or apply() as in the following examples.
        function strictFnDeclare() {
            'use strict';
            console.log('strictFnDeclare: ', this);
        }
        fnExpr();
        fnDeclare();
        strictFnDeclare();
    }
};
myObj.fn();