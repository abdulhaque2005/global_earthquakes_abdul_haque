const setupEarthquakeSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket Client Interfaced: ${socket.id}`);
    socket.emit('serverHandshake', {
      status: 'Connected',
      timestamp: new Date(),
      message: 'Subscribed to QuakeVision Live Data Distribution Grid.',
    });
    socket.on('subscribeToRiskLevel', (riskLevel) => {
      socket.join(`risk_${riskLevel}`);
      console.log(`Client ${socket.id} joined channel: risk_${riskLevel}`);
    });
    socket.on('subscribeToAlerts', () => {
      socket.join('emergency_alerts');
      console.log(`Client ${socket.id} subscribed to Real-Time Emergency Alerts stream.`);
    });
    socket.on('disconnect', () => {
      console.log(`Socket Client Terminated: ${socket.id}`);
    });
  });
};
export default setupEarthquakeSockets;
