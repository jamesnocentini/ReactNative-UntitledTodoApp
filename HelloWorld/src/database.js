'use strict';

// 1
import {manager, ReactCBLite} from 'react-native-couchbase-lite';

// 2
ReactCBLite.init(5984, 'admin', 'pass');

// 3
var database = new manager('http://admin:password@localhost:5984/', 'myapp');

// 4
module.exports = database;