import express, { Request, Response, NextFunction } from 'express';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { Kafka, Producer } from 'kafkajs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Type definitions aligned with TSX component
interface CustomerInfo {
  customerId: string;
  email: string;
}

interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

interface OrderData {
  products: OrderProduct[];
  totalAmount: number;
  customerInfo: CustomerInfo;
}

// Extended interface for database document
interface IOrder extends Document {
  orderId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customerInfo: CustomerInfo;
  createdAt: Date;
  updatedAt: Date;
}

// Kafka event interface
interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  timestamp: string;
  eventType: 'ORDER_CREATED';
}

// API Response interfaces
interface ApiSuccessResponse {
  success: true;
  message?: string;
  orderId?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: Date;
  data?: any;
  count?: number;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Health check response interface
interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

// Custom Request interface for order creation
interface CreateOrderRequest extends Request {
  body: OrderData;
}

// Status update request interface
interface UpdateStatusRequest extends Request {
  body: {
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  };
  params: {
    orderId: string;
  };
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/novashop');

// Order Schema
const orderSchema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  products: [{
    productId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  customerInfo: {
    customerId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

// Kafka Configuration
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer: Producer = kafka.producer();

// Initialize Kafka Producer
const initKafka = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Error connecting to Kafka:', error);
  }
};

// Utility function to generate order ID
const generateOrderId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Publish order created event to Kafka
const publishOrderCreatedEvent = async (orderData: IOrder): Promise<void> => {
  try {
    const event: OrderCreatedEvent = {
      orderId: orderData.orderId,
      customerId: orderData.customerInfo.customerId,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
      timestamp: new Date().toISOString(),
      eventType: 'ORDER_CREATED'
    };

    await producer.send({
      topic: 'order-created',
      messages: [
        {
          key: orderData.orderId,
          value: JSON.stringify(event),
        },
      ],
    });
    console.log(`Order created event published for order: ${orderData.orderId}`);
  } catch (error) {
    console.error('Error publishing order created event:', error);
    throw error;
  }
};

// Type guard for order data validation
const isValidOrderData = (body: any): body is OrderData => {
  return (
    body &&
    typeof body === 'object' &&
    Array.isArray(body.products) &&
    body.products.length > 0 &&
    typeof body.totalAmount === 'number' &&
    body.totalAmount > 0 &&
    body.customerInfo &&
    typeof body.customerInfo.customerId === 'string' &&
    typeof body.customerInfo.email === 'string' &&
    body.products.every((product: any) => 
      typeof product.productId === 'string' &&
      typeof product.quantity === 'number' &&
      typeof product.price === 'number' &&
      product.quantity > 0 &&
      product.price >= 0
    )
  );
};

// Routes

// Health check endpoint
app.get('/health', (req: Request, res: Response<HealthResponse>) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'order-service',
    timestamp: new Date().toISOString()
  });
});

// Get all orders (for testing purposes)
app.get('/orders', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get specific order by ID
app.get('/orders/:orderId', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create new order - Main endpoint for the assignment
app.post('/orders', async (req: CreateOrderRequest, res: Response<ApiResponse>) => {
  try {
    // Validate request body using type guard
    if (!isValidOrderData(req.body)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order data. Please provide valid products, total amount, and customer information'
      });
    }

    const { products, totalAmount, customerInfo } = req.body;

    // Calculate and verify total amount
    const calculatedTotal = products.reduce((total: number, product: OrderProduct) => {
      return total + (product.price * product.quantity);
    }, 0);

    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        error: 'Total amount does not match the sum of product prices'
      });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Create order document
    const orderData = {
      orderId,
      products,
      totalAmount,
      status: 'pending' as const,
      customerInfo
    };

    // Save to MongoDB
    const order = new Order(orderData);
    await order.save();

    // Publish order created event to Kafka
    await publishOrderCreatedEvent(order);

    // Return success response with order ID
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: orderId,
      status: 'pending',
      totalAmount: totalAmount,
      createdAt: order.createdAt
    });

    console.log(`Order created successfully: ${orderId}`);

  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle duplicate order ID (unlikely but possible)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Order ID conflict, please try again'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update order status (for other services)
app.patch('/orders/:orderId/status', async (req: UpdateStatusRequest, res: Response<ApiResponse>) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const validStatuses: Array<'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'> = 
      ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response<ApiErrorResponse>, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response<ApiErrorResponse>) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize Kafka
    await initKafka();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  try {
    await producer.disconnect();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();