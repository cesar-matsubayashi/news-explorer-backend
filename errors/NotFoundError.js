class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = "DocumentNotFound";
  }
}
module.exports = NotFoundError;
