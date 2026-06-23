import {
  deleteUrl,
  getAllUrls,
  urlAnalytics,
  shortenUrl,
} from "../controllers/url.controller.js";

import { Router } from "express";
import protect, { optionalProtect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/shorten", optionalProtect, shortenUrl);

router.get("/urls", protect, getAllUrls);

router.delete("/:code", protect, deleteUrl);

router.get("/urls/analytics/:code", protect, urlAnalytics);

export default router;
