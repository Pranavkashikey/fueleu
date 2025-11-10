import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Container } from '../di/container';
import { createRouteRoutes } from '../../adapters/inbound/http/routes/routeRoutes';
import { createComplianceRoutes } from '../../adapters/inbound/http/routes/complianceRoutes';
import { createBankingRoutes } from '../../adapters/inbound/http/routes/bankingRoutes';
import { createPoolRoutes } from '../../adapters/inbound/http/routes/poolRoutes';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;


const container = new Container();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FuelEU Backend is running!',
    timestamp: new Date().toISOString()
  });
});


app.use('/api/routes', createRouteRoutes(container.routeController));
app.use('/api/compliance', createComplianceRoutes(container.complianceController));
app.use('/api/banking', createBankingRoutes(container.bankingController));
app.use('/api/pools', createPoolRoutes(container.poolingController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(' Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});


app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});


const server = app.listen(PORT, () => {
  console.log('\n ============================================');
  console.log(' FuelEU Maritime Backend Server Started!');
  console.log('============================================');
  console.log(` Server URL: http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(` CORS Enabled: http://localhost:5173`);
  console.log('============================================\n');
  console.log(' Available Endpoints:');
  console.log('  GET    /api/routes');
  console.log('  POST   /api/routes/:id/baseline');
  console.log('  GET    /api/routes/comparison');
  console.log('  GET    /api/compliance/cb?shipId=X&year=Y');
  console.log('  GET    /api/compliance/adjusted-cb?year=Y');
  console.log('  POST   /api/banking/bank');
  console.log('  POST   /api/banking/apply');
  console.log('  POST   /api/pools');
  console.log('============================================\n');
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n ${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await container.disconnect();
      console.log(' Database connections closed');
      console.log(' Goodbye!\n');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.error(' Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default app;
