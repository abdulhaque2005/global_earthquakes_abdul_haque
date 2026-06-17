import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { config } from '../config/config';
export const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io(config.SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
