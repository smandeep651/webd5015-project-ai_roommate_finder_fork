'use client';

import { useState } from 'react';
import WelcomeUpload from './_components/WelcomeUpload';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    profileImageUrl: '',
    // other fields will go here later
  });

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, profileImageUrl: url }));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      {step === 1 && <WelcomeUpload onImageUpload={handleImageUpload} />}
      {/* More steps will come here */}
    </div>
  );
}
