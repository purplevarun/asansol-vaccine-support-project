const local = "mongodb://localhost/vaccine-local";
module.exports = process.env.mongoURL || local;
