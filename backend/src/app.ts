import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import config from './config/env.config';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('dev'));
    }
  }

  private setupRoutes(): void {
    // API routes
    this.app.use('/api', routes);

    // Health check route
    this.app.get('/health', (_, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Handle 404
    this.app.use((_, res) => {
      res.status(404).json({ message: 'Not Found' });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  public listen(): void {
    const port = config.port || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default App; 