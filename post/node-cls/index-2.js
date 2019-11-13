var createNamespace = require('continuation-local-storage').createNamespace;

var writer = createNamespace('writer');
writer.run(function () {
  writer.set('value', 0);

  requestHandler();
});

function requestHandler() {
  writer.run(function(outer) {
    console.log(writer.get('value')); // prints 0
    // outer.value is 0
    writer.set('value', 1);
    console.log(writer.get('value'), 1); // prints 0
    // outer.value is 1
    process.nextTick(function() {
      console.log(writer.get('value'), 1); // prints 0
      // outer.value is 1
      writer.run(function(inner) {
        console.log(writer.get('value'), 1); // prints 0
        // outer.value is 1
        // inner.value is 1
        writer.set('value', 2);
        console.log(writer.get('value'), 2); // prints 0
        // outer.value is 1
        // inner.value is 2
      });
    });
  });

  setTimeout(function() {
    // runs with the default context, because nested contexts have ended
    console.log(writer.get('value')); // prints 0
  }, 1000);
}
