"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPIRoute = createAPIRoute;
function createAPIRoute(data) {
    data.path = "/api" + data.path;
    return {
        execute: function (app, client) {
            data.methods.forEach((method) => {
                app[method](data.path, (req, res, next) => data.callback({ client, req, res, next }));
            });
        },
        data,
    };
}
