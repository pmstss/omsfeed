"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen errors with friendly messages
    if (error.code === 'EACCES') {
        console.error('Port requires elevated privileges');
        process.exit(1);
    }
    else if (error.code === 'EADDRINUSE') {
        console.error('Port is already in use');
        process.exit(1);
    }
    else {
        throw error;
    }
}
exports.onError = onError;
function onListening() {
    const addr = server_1.default.address();
    console.log(`Listening on ${addr.port}`);
}
exports.onListening = onListening;
