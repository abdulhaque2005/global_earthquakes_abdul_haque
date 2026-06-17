import morgan from 'morgan';
const requestLogger = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev');
export default requestLogger;
