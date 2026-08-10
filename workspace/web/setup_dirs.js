var fs = require('fs');
var path = require('path');

var root = 'E:/360MoveData/Users/admin/Documents/小学数学自测及辅导/workspace/web';
var serverRoot = root + '/server';
var clientRoot = root + '/client';

// Create server dirs
['src/routes','src/middleware','src/services','src/utils','src/models','database/migrations','database/seed','data'].forEach(function(d){
  fs.mkdirSync(serverRoot + '/' + d, {recursive:true});
});

// Create client dirs
['src/router','src/stores','src/views','src/components','src/api','src/utils','src/styles','src/types','public'].forEach(function(d){
  fs.mkdirSync(clientRoot + '/' + d, {recursive:true});
});

console.log('All directories created');
