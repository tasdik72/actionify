import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former product manager at Google with 10+ years in AI and meeting technology.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'AI researcher and former engineering lead at Microsoft, specializing in NLP and speech recognition.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'UX designer and product strategist with expertise in enterprise software and user experience.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'David Kim',
      role: 'Lead Engineer',
      bio: 'Full-stack developer and DevOps expert with a passion for scalable, secure systems.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To democratize meeting intelligence and help teams make every conversation count through intelligent analysis and actionable insights.'
    },
    {
      icon: Users,
      title: 'Vision',
      description: 'A world where no important decision or action item is lost in meetings, and every team can collaborate more effectively.'
    },
    {
      icon: Award,
      title: 'Values',
      description: 'We believe in transparency, security, and user-centric design. Every feature we build is designed to solve real problems.'
    },
    {
      icon: Heart,
      title: 'Impact',
      description: 'Helping teams save hours every week and make better decisions through data-driven meeting insights.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About
            <span className="text-black"> Actionify</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to transform how teams collaborate and make decisions through intelligent meeting analysis.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-lg p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Actionify was born from a simple observation: too many important decisions and action items get lost in meetings. 
                As former product managers and engineers at major tech companies, we experienced firsthand how inefficient meetings 
                can derail projects and slow down progress.
              </p>
              <p className="text-gray-600 mb-6">
                We set out to solve this problem by building intelligent tools that automatically extract insights from meetings, 
                identify action items, and help teams stay organized and accountable. Our platform combines advanced AI with 
                intuitive design to make meeting intelligence accessible to everyone.
              </p>
              <p className="text-gray-600">
                Today, Actionify helps thousands of teams worldwide turn their meetings into actionable insights, saving hours 
                of manual work and ensuring nothing important gets lost in translation.
              </p>
            </div>
            <div className="bg-black rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">By the Numbers</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-blue-100">Meetings Analyzed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-blue-100">Active Teams</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50,000+</div>
                  <div className="text-blue-100">Action Items Extracted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">95%+</div>
                  <div className="text-blue-100">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Mission?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start transforming your meetings today and be part of the future of intelligent collaboration.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;