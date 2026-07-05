"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, upload_controller_1.upload.single('image'), upload_controller_1.uploadImage);
router.delete('/:publicId', auth_middleware_1.authenticate, upload_controller_1.deleteImage);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map