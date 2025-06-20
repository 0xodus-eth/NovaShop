const express = require('express');
const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/novashop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Order Schema
const orderSchema = new mongoose.Schema({
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

const Order = mongoose.model('Order', orderSchema);

// Kafka Configuration
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

// Initialize Kafka Producer
const initKafka = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Error connecting to Kafka:', error);
  }
};

// Utility function to generate order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Publish order created event to Kafka
const publishOrderCreatedEvent = async (orderData) => {
  try {
    await producer.send({
      topic: 'order-created',
      messages: [
        {
          key: orderData.orderId,
          value: JSON.stringify({
            orderId: orderData.orderId,
            customerId: orderData.customerInfo.customerId,
            products: orderData.products,
            totalAmount: orderData.totalAmount,
            status: orderData.status,
            timestamp: new Date().toISOString(),
            eventType: 'ORDER_CREATED'
          }),
        },
      ],
    });
    console.log(`Order created event published for order: ${orderData.orderId}`);
  } catch (error) {
    console.error('Error publishing order created event:', error);
    throw error;
  }
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'order-service',
    timestamp: new Date().toISOString()
  });
});

// Get all orders (for testing purposes)
app.get('/orders', async (req, res) => {
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
app.get('/orders/:orderId', async (req, res) => {
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
app.post('/orders', async (req, res) => {
  try {
    const { products, totalAmount, customerInfo } = req.body;

    // Validation
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Products array is required and cannot be empty'
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total amount must be greater than 0'
      });
    }

    if (!customerInfo || !customerInfo.customerId || !customerInfo.email) {
      return res.status(400).json({
        success: false,
        error: 'Customer information (customerId and email) is required'
      });
    }

    // Validate products
    for (const product of products) {
      if (!product.productId || !product.quantity || product.quantity <= 0 || !product.price || product.price < 0) {
        return res.status(400).json({
          success: false,
          error: 'Each product must have valid productId, quantity (>0), and price (>=0)'
        });
      }
    }

    // Calculate and verify total amount
    const calculatedTotal = products.reduce((total, product) => {
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
      status: 'pending',
      customerInfo
    };

    // Save to MongoDB
    const order = new Order(orderData);
    await order.save();

    // Publish order created event to Kafka
    await publishOrderCreatedEvent(orderData);

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
    if (error.code === 11000) {
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
app.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
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
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const startServer = async () => {
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