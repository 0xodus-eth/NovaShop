//  healthApi to switch between a real backend health check implementation and a mock implementation based on environment or some flag

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3001';

// Environment variable to choose mock or real API, default false
const USE_MOCK_HEALTH_API = process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_API === 'true';

// Mock implementation returns fixed values with simulated delay
async function mockCheckServices() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate 1s delay

  return [
    { name: 'Product Service', status: 'healthy', url: `${PRODUCT_SERVICE_URL}/health` },
    { name: 'Order Service', status: 'healthy', url: `${ORDER_SERVICE_URL}/health` },
    { name: 'Kafka Broker', status: 'unhealthy', url: '/kafka', error: 'Connection timeout' }
  ];
}

// Real implementation: fetch actual health endpoints
async function realCheckServices() {
  const services = [
    { name: 'Product Service', url: `${PRODUCT_SERVICE_URL}/health` },
    { name: 'Order Service', url: `${ORDER_SERVICE_URL}/health` }
  ];

  const results = await Promise.allSettled(
    services.map(async (service) => {
      try {
        const response = await fetch(service.url);
        return {
          name: service.name,
          status: response.ok ? 'healthy' : 'unhealthy',
          url: service.url
        };
      } catch (error) {
        return {
          name: service.name,
          status: 'unhealthy',
          url: service.url,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );

  return results.map((result, index) => ({
    ...services[index],
    ...(result.status === 'fulfilled' ? result.value : { status: 'error', error: result.reason })
  }));
}

// Export single healthApi object with checkServices switching based on env flag
export const healthApi = {
  checkServices: USE_MOCK_HEALTH_API ? mockCheckServices : realCheckServices
};




// Real Health API

/*

// src/services/healthApi.ts

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3001';

export const healthApi = {
  checkServices: async () => {
    const services = [
      { name: 'Product Service', url: `${PRODUCT_SERVICE_URL}/health` },
      { name: 'Order Service', url: `${ORDER_SERVICE_URL}/health` }
    ];

    const results = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const response = await fetch(service.url);
          return {
            name: service.name,
            status: response.ok ? 'healthy' : 'unhealthy',
            url: service.url
          };
        } catch (error) {
          return {
            name: service.name,
            status: 'unhealthy',
            url: service.url,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    return results.map((result, index) => ({
      ...services[index],
      ...(result.status === 'fulfilled' ? result.value : { status: 'error', error: result.reason })
    }));
  }
};

*/


// MOCK HEALTH API IMPLEMENTATION

/*

export const healthApi = {
  async checkServices() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { name: 'Orders Service', status: 'healthy', url: '/orders' },
      { name: 'Payments Service', status: 'healthy', url: '/payments' },
      { name: 'Kafka Broker', status: 'unhealthy', url: '/kafka', error: 'Connection timeout' }
    ];
  }
};

*/