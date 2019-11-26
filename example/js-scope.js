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
