module.exports = base64 = (req, res, next) => {
  try {
    const { data } = req.body;
    if (data) {
      const decodedString = Buffer.from(data, "base64").toString("utf-8");
      const parsedData = JSON.parse(decodedString);

      req.body = parsedData;
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Base64 data" });
  }
};
