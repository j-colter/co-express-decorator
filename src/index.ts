function f() {
  console.log("f(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("f(): called");
  }
}

interface IG {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
}

function g(param: IG) {
  console.log("g(): evaluated", param);
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("g(): called", target, propertyKey, descriptor);
  }
}

class C {
  @f()
  @g({ method: 'POST' })
  method() {}
}

new C();
console.log('--->', C);
