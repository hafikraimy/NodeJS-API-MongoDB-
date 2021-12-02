
module.exports = (app) => {
    app.use("/api", require("./user"));
    app.use("/api/carlist", require("./car-list"));
};