import { Url } from "../models/url.model.js";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const generateCode = (len = 6) => {
  let code = "";
  for (let i = 0; i < len; i++) {
    code += BASE62[Math.floor(Math.random() * 62)];
  }
  return code;
};

const generateUniqueCode = async () => {
  let code, existing;
  do {
    code = generateCode(6);
    existing = await Url.findOne({ code });
  } while (existing);

  return code;
};

export const shortenUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "url required !!" });
    }

    const code = await generateUniqueCode();

    const userId = req?.user?.id ?? null;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await Url.create({
      code,
      longUrl: url,
      userId: userId,
      expiresAt,
    });

    const shortUrl = `${process.env.BASE_URL}/${code}`;

    return res.status(201).json({
      message: "url shotened successfully !",
      data: {
        shortUrl: shortUrl,
        code,
        url: url,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        message: "no link found !",
      });
    }

    const urlData = await Url.findOne({ code });

    if (!urlData) {
      return res.status(404).json({ message: "no data found !!" }); // 404 - not found
    }

    if (urlData.expiresAt && urlData.expiresAt < new Date()) {
      return res.status(410).json({ message: "This URL has expired" });
    }

    res.redirect(302, urlData.longUrl);

    Url.findByIdAndUpdate(urlData._id, {
      $inc: { clicks: 1 },
      $push: {
        clickLogs: {
          timeStamp: new Date(),
          ip: req.ip,
        },
      },
    }).catch((err) => console.log("Click tracking failed:", err));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "not authorized !!" });
    }

    const urlsData = await Url.find({ userId: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUrls = await Url.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalUrls / limit);

    return res.status(200).json({
      data: urlsData,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error !",
    });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ message: "no url found !" });
    }

    const url = await Url.findOneAndDelete({ code, userId: req.user.id });

    if (!url) {
      return res.status(404).json({ message: "URL not found !" });
    }

    return res.status(200).json({ message: "url deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const urlAnalytics = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user.id;

    const urlData = await Url.findOne({ code, userId: userId });

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    const totalClicks = urlData?.clicks;

    const last7DaysDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentLogs = urlData.clickLogs.filter(
      (log) => new Date(log.timeStamp) >= last7DaysDate
    );

    const groupedByDate = {};

    recentLogs.forEach((log) => {
      const date = new Date(log.timeStamp).toISOString().split("T")[0];
      groupedByDate[date] = (groupedByDate[date] || 0) + 1;
    });

    const last7Days = Object.entries(groupedByDate)
      .map(([date, clicks]) => ({
        date,
        clicks,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const allIps = {};

    const ips = urlData.clickLogs;

    ips.forEach((log) => {
      allIps[log.ip] = (allIps[log.ip] || 0) + 1;
    });

    const topIps = Object.entries(allIps)
      .map(([ip, count]) => ({
        ip,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return res.status(200).json({
      code,
      shortUrl: `${process.env.BASE_URL}/${code}`,
      longUrl: urlData.longUrl,
      totalClicks,
      createdAt: urlData.createdAt,
      expiresAt: urlData.expiresAt,
      last7Days,
      topIps,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
