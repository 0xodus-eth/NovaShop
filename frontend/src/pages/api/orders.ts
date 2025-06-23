import { NextApiRequest, NextApiResponse } from 'next';

// Type definitions to match the TSX component
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

interface ApiSuccessResponse {
  orderId: string;
  message?: string;
  totalAmount?: number;
  products?: OrderProduct[];
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Type guard to check if request body is valid OrderData
function isValidOrderData(body: any): body is OrderData {
  return (
    body &&
    typeof body === 'object' &&
    Array.isArray(body.products) &&
    body.products.length > 0 &&
    typeof body.totalAmount === 'number' &&
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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    if (!isValidOrderData(req.body)) {
      return res.status(400).json({ 
        error: 'Invalid order data',
        details: 'Please provide valid products, total amount, and customer information'
      });
    }

    const orderData: OrderData = req.body;
    const orderServiceUrl: string = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';
    
    const response = await fetch(`${orderServiceUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error calling order service:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({ 
      error: 'Failed to create order',
      details: errorMessage
    });
  }
}

/* 
// Alternative: For App Router (app/api/orders/route.ts):
import { NextRequest, NextResponse } from 'next/server';

// Same type definitions as above...

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body: unknown = await request.json();
    
    // Validate request body
    if (!isValidOrderData(body)) {
      return NextResponse.json(
        { 
          error: 'Invalid order data',
          details: 'Please provide valid products, total amount, and customer information'
        },
        { status: 400 }
      );
    }

    const orderData: OrderData = body;
    const orderServiceUrl: string = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';
    
    const response = await fetch(`${orderServiceUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error calling order service:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
*/