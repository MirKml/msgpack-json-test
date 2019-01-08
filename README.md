MsgPack vs native JSON browser test
=============

Compare encoding and decoding with [msgPack](https://github.com/ygoe/msgpack.js) and native browser JSON.
Typescript, webpack is used. Used msgpack implementation isn't module, just simple js file, hence typings for Typescript and
ES6 module definition is added.

Build

    $ cd msgpack-json-test 
    $ npm install
    $ npm run build
    
Open public/index.html in browser, wait (around minute for IE, about 30s in others) for result.

Result
------------
in Chrome on Intel i7 2. generation

[Testing](https://github.com/MirKml/msgpack-json-test/blob/master/src/app.ts#L7) object

50 0000 x encode same object - MsgPack: 2122 ms JSON: 596 ms  
50 0000 x decode same object - MsgPack: 1958 ms JSON: 1061 ms

Testing for array of 50 000 object copies

encode - MsgPack: 4307 ms JSON: 1479 ms  
decode - MsgPack: 13114 ms JSON: 2758 ms

In IE (only test for 5000 operations, more freeze the browser)

5000 x encode same object - MsgPack: 1024 ms JSON: 92 ms  
5000 x decode same object - MsgPack: 830 ms JSON: 60 ms

In Edge (only test for 5000 operations, more freezes the browser)

5000 x encode same object - MsgPack: 4197 ms JSON: 79 ms  
5000 x decode same object - MsgPack: 2679 ms JSON: 7 ms
