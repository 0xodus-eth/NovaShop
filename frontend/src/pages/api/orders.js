export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';
    
    const response = await fetch(`${orderServiceUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error calling order service:', error);
    return res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
}

/* 
// Alternative: For App Router (app/api/orders/route.js):
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';
    
    const response = await fetch(`${orderServiceUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error calling order service:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
*/