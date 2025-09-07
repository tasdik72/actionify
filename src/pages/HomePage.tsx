import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import UploadSection from '../components/UploadSection';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleFileUploaded = (data: any) => {
    navigate('/actionify', { state: { uploadData: data } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-height landing section */}
      <section className="relative min-h-[80vh] flex items-center">
        {/* subtle background shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-gray-100" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-3xl bg-gray-100 rotate-6" />
          <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border border-gray-200" />
        </div>
        <div className="relative w-full">
          <Hero />
        </div>
      </section>

      {/* Upload teaser that redirects to /app */}
      <section className="py-8">
        <UploadSection onFileUploaded={handleFileUploaded} />
      </section>

      {/* Feature Highlights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accurate Transcription</h3>
              <p className="text-gray-600">Upload recordings and get high-accuracy transcripts with speaker labels.</p>
              <button onClick={() => navigate('/features')} className="mt-4 text-gray-900 underline">Learn more</button>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Actionable Insights</h3>
              <p className="text-gray-600">Automatic summaries, action items, and decisions extracted from meetings.</p>
              <button onClick={() => navigate('/features')} className="mt-4 text-gray-900 underline">Learn more</button>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Analytics</h3>
              <p className="text-gray-600">Understand sentiment and engagement across your team.</p>
              <button onClick={() => navigate('/features')} className="mt-4 text-gray-900 underline">Learn more</button>
            </div>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for teams who value clarity</h2>
            <p className="text-gray-600">Actionify helps you capture what matters and move work forward confidently.</p>
            <button onClick={() => navigate('/about')} className="mt-6 text-gray-900 underline">Learn more about us</button>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 border border-gray-200 rounded-2xl" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border border-gray-200 rounded-full" />
            <div className="bg-gray-100 h-56 rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;