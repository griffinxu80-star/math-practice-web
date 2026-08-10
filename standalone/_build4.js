const fs = require('fs');
const path = require('path');
const root = 'E:/360MoveData/Users/admin/Documents/小学数学自测及辅导/standalone';

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>小学数学自测辅导 - 本地版</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app"></div>
  
  <script src="js/store.js"></script>
  <script src="js/seed.js"></script>
  <script src="js/app.js"></script>
  <script src="js/router.js"></script>
  <script src="js/pages.js"></script>
  <script>
    App.init();
    Router.init();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');
console.log('index.html written');
