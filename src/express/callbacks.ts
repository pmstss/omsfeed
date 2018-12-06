import server from '../server';
import { AddressInfo } from 'net';

export function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    if (error.code === 'EACCES') {
        console.error('Port requires elevated privileges');
        process.exit(1);
    } else if (error.code === 'EADDRINUSE') {
        console.error('Port is already in use');
        process.exit(1);
    } else {
        throw error;
    }
}

export function onListening() {
    const addr = <AddressInfo>server.address();
    console.log(`Listening on ${addr.port}`);
}
