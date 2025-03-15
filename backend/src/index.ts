import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import routes from './routes';
import { connectDB } from './config/database';
import { DatabaseSeeder } from './seeds';
import logger from './utils/logger';

// Load environment variables
config();

const app = express();

// Create custom Morgan token for request ID
morgan.token('id', (req: any) => req.id);

// Create custom Morgan format that writes to Winston
app.use(morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  }
));

// Connect to MongoDB and run seeds
const initializeApp = async () => {
  try {
    await connectDB();
    logger.info('Server initialization started');
    
    // Run database seeds
    await DatabaseSeeder.run();
    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Error during initialization:', { error });
    process.exit(1);
  }
};

initializeApp();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Swagger documentation
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Playground API',
      version: '1.0.0',
      description: 'API documentation for the Playground application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: 'Development server',
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.ts'), path.join(__dirname, './schemas/*.ts')],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', { 
    error: err,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      user: req.user
    }
  });
  
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 