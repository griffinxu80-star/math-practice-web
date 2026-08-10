path = r'E:\360MoveData\Users\admin\Documents\小学数学自测及辅导\workspace\web\server\dist\routes\auth.js'
lines = [
    '"use strict";',
    'var __importDefault = (this && this.__importDefault) || function (mod) {',
    "    return (mod && mod.__esModule) ? mod : { 'default': mod };",
    '};',
    'Object.defineProperty(exports, '__esModule', { value: true });',
    'const express_1 = __importDefault(require("express"));',
    'const auth_1 = require("../middleware/auth.js");',
    'const auth_svc_1 = require("../services/auth");',
    'const router = express_1.default.Router();',
    "router.post('/register', auth_svc_1.register);",
    "router.post('/login', auth_svc_1.login);",
    "router.get('/me', auth_1.authenticate, auth_svc_1.getMe);",
    "router.put('/profile', auth_1.authenticate, auth_svc_1.updateProfile);",
    'exports.default = router;',
    '//# sourceMappingURL=auth.js.map',
]
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print('Patched auth.js')
