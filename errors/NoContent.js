class NoContent extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 204;
    this.name = "NoContent";
  }
}
module.exports = NoContent;
