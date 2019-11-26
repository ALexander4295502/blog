console.log('\n\x1b[36m%s\x1b[0m', 'First example'); 
var a = 1;
(function b() {
	a = 10;
    return;
    // if you comment out this line, scope bubble up won't trigger 
    // since it declare a local varialbe in the function-level scope
    // and hoist it before operations in this scope
	function a() {}
})();
console.log(a); // 1 (since inner scope declare a local variable 'a' by hoisting the function declaration)

console.log('\n\x1b[36m%s\x1b[0m', 'Second example'); 
if (true) {
    foo();               // Works just fine
    function foo() {
    }
}
console.log(typeof foo); 
// "function" if not in strict mode, otherwise:
// "undefined" (`foo` is not in scope here
// because it's not in the same block)

console.log('\n\x1b[36m%s\x1b[0m', 'Third example'); 
var z = function w() {
    console.log('inside for z: ', typeof z); // "function"
    console.log('inside for w: ', typeof w); // "function"
};
z();
console.log('outside for z: ', typeof z);     // "function"
console.log('outside for w: ', typeof w);     // "undefined"