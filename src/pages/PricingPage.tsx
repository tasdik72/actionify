import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for individuals and small teams',
      features: [
        'Up to 5 meetings per month',
        'Basic transcription',
        'Simple summaries',
        'Standard support',
        'Basic export options'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'Ideal for growing teams and businesses',
      features: [
        'Unlimited meetings',
        'Advanced transcription with speaker ID',
        'Detailed summaries & action items',
        'Sentiment analysis',
        'Priority support',
        'Advanced export options',
        'Team collaboration',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations with advanced needs',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated account manager',
        'On-premise deployment',
        'Advanced security features',
        'Custom training',
        'SLA guarantees',
        'White-label options'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-black"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-3xl shadow-lg p-8 ${
              plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                plan.popular
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What file formats do you support?</h3>
              <p className="text-gray-600">We support MP3, WAV, M4A, FLAC audio files and MP4, MOV, AVI, WEBM video files up to 2GB.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is the transcription?</h3>
              <p className="text-gray-600">Our transcription accuracy is 95%+ for clear audio with proper speaker identification.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts required.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
              <p className="text-gray-600">Absolutely. We use enterprise-grade encryption and never share your data with third parties.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer team discounts?</h3>
              <p className="text-gray-600">Yes, we offer volume discounts for teams of 10+ users. Contact us for custom pricing.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What languages are supported?</h3>
              <p className="text-gray-600">We currently support English, Spanish, French, German, and Italian with more coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;