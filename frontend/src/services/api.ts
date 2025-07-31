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