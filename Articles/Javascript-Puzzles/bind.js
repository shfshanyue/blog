Function.prototype.fakeBind = function (obj) {
  var self = this;
  return function () {
    self.call(obj);
  }
}

Function.prototype.softBind = function(obj) {
  var self = this;
  return function () {
    self.call(this === undefined || this === global ? obj : this);
  }
};

function foo () {
  console.log(this.a)
}

const o1 = { a: 3 }
const o2 = { a: 4 }

const bar = foo.fakeBind(o1).fakeBind(o2);
bar();            // 3

const baz = foo.softBind(o1).softBind(o2);
baz();            // 4
