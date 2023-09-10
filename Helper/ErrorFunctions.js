function sendresponse(res, status, message, data = null) {
  if (message === "success") {
    res.status(status).json({ status, message, data });
  } else if (message === "fail") {
    if (data.name === "ValidationError") {
      res.status(400).json({ status: 400, message, error: data.message });
    } else {
      res.status(status).json({ status, message, error: data });
    }
  }
}

module.exports = sendresponse;
