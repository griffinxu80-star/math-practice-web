import os
path = r'E:\360MoveData\Users\admin\Documents\小学数学自测及辅导\standalone\test-simple.html'
content = '<!DOCTYPE html>'
content += '<html lang=\"zh-CN\">'
content += '<head><meta charset=\"UTF-8\"><title>Test</title></head>'
content += '<body><h1>Server is working!</h1>'
content += '<p>If you see this, the server is OK.</p>'
content += '<p>Time: <span id=\"time\"></span></p>'
content += '<script>document.getElementById(\"time\").textContent = new Date().toLocaleString(\"zh-CN\");</script>'
content += '</body></html>'
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('test-simple.html created')
