const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Video Extractor Backend Running ✅");
});

app.get("/video", async (req, res) => {
  try {
    const pageUrl = req.query.url;

    if (!pageUrl) {
      return res.status(400).json({
        success: false,
        message: "URL missing"
      });
    }

    const response = await axios.get(pageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0"
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    let videoUrl = null;

    // 1. Find video tag
    $("video").each((i, el) => {
      if (!videoUrl) {
        videoUrl =
          $(el).attr("src") ||
          $(el).find("source").attr("src");
      }
    });

    // 2. Find Open Graph video
    if (!videoUrl) {
      videoUrl =
        $('meta[property="og:video"]').attr("content") ||
        $('meta[property="og:video:url"]').attr("content");
    }

    // Convert relative URL to absolute
    if (videoUrl && !videoUrl.startsWith("http")) {
      videoUrl = new URL(videoUrl, pageUrl).href;
    }

    if (!videoUrl) {
      return res.json({
        success: false,
        message: "No video found"
      });
    }

    res.json({
      success: true,
      video: videoUrl
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to extract video",
      error: error.message
    });

  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});