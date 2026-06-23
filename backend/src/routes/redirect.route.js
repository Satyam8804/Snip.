import { redirectUrl } from "../controllers/url.controller.js";

import { Router } from "express";

const router = Router();

router.get("/:code",redirectUrl);

export default router;