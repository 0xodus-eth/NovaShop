import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Zap, Shield, Globe, TrendingUp, Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { healthApi } from '../services/api';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

interface ServiceStatus {
  name: string;
  status: string;
  url: string;
  error?: string;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    const checkServiceHealth = async () => {
      try {
        setStatusLoading(true);
        const statuses = await healthApi.checkServices();
        setServiceStatuses(statuses);
      } catch (error) {
        console.error('Error checking service health:', error);
      } finally {
        setStatusLoading(false);
      }
    };

    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: 'Order Management',
      description: 'Complete order processing with real-time status updates and inventory management.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Enterprise-grade security with multiple payment gateway integrations.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Built on microservices architecture for worldwide scalability.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Real-time Events',
      description: 'Kafka-powered event streaming for instant communication between services.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'unhealthy':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'unhealthy':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              NovaShop
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Experience the future of e-commerce with our cutting-edge platform built on 
            React, TypeScript, Node.js, MongoDB, and Kafka for unparalleled scalability and performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('products')}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Create Order
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need for
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              modern e-commerce
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with enterprise-grade architecture and cutting-edge technologies 
            to deliver exceptional performance and scalability.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Status */}
      <section className="py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">System Status</h3>
          {statusLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking service status...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Frontend Status */}
              <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-semibold text-gray-900">Frontend</div>
                <div className="text-sm text-green-600 font-medium">Operational</div>
              </div>
              {/* Service Statuses */}
              {serviceStatuses.map((service, index) => (
                <div key={index} className={`text-center p-6 rounded-2xl border ${getStatusColor(service.status)}`}>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {getStatusIcon(service.status)}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{service.name}</div>
                  <div className="text-sm font-medium capitalize">
                    {service.status === 'healthy' ? 'Operational' : 
                     service.status === 'unhealthy' ? 'Down' : 'Checking...'}
                  </div>
                  {service.error && (
                    <div className="text-xs mt-1 opacity-75">
                      {service.error}
                    </div>
                  )}
                </div>
              ))}
              {/* MongoDB Status */}
              <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-semibold text-gray-900">MongoDB</div>
                <div className="text-sm text-blue-600 font-medium">Operational</div>
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Services are monitored in real-time. Status updates every 30 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            NovaShop leverages cutting-edge technologies to deliver exceptional performance and developer experience.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'React 19', desc: 'Frontend Framework' },
            { name: 'TypeScript', desc: 'Type Safety' },
            { name: 'Node.js', desc: 'Backend Runtime' },
            { name: 'MongoDB', desc: 'Database' },
            { name: 'Kafka', desc: 'Event Streaming' },
            { name: 'Docker', desc: 'Containerization' },
            { name: 'Kubernetes', desc: 'Orchestration' },
            { name: 'Tailwind CSS', desc: 'Styling' }
          ].map((tech, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">{tech.name.charAt(0)}</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{tech.name}</h4>
              <p className="text-gray-600 text-xs">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our products, create orders, and experience the power of modern e-commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('products')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
            >
              Browse Products
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              Create Order
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;