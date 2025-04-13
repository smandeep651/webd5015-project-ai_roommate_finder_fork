'use client';

import { useState } from 'react';
import WelcomeUpload from '../_components/WelcomeUpload';
import AboutYou from '../_components/AboutYou';
import PreferencesForm from '../_components/PreferencesForm';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    profileImageUrl: '',
    name: '',
    bio: '',
    age: 0,
    sex: '',
    occupation: '',
    preferredLocation: '',
    ethnicity: '',
    religion: '',
    ageRange: { min: 18, max: 35 },
    genderPreference: '',
    accommodationType: '',
    budget: { min: 500, max: 1500 },
    pets: { hasPets: false, type: '' },
    habits: {
      sleepPattern: '',
      drinking: false,
      smoking: false,
    },
    cooking: '',
  });

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, profileImageUrl: url }));
    setStep(2);
  };

  const handleAboutYouSubmit = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handlePreferencesSubmit = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(4);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      {step === 1 && <WelcomeUpload onImageUpload={handleImageUpload} />}

      {step === 2 && (
        <AboutYou
          initialData={{
            name: formData.name,
            bio: formData.bio,
            age: formData.age,
            sex: formData.sex,
            occupation: formData.occupation,
          }}
          onNext={handleAboutYouSubmit}
        />
      )}

      {step === 3 && (
        <PreferencesForm
          initialData={{
            preferredLocation: formData.preferredLocation,
            ethnicity: formData.ethnicity,
            religion: formData.religion,
            ageRange: formData.ageRange,
            genderPreference: formData.genderPreference,
            accommodationType: formData.accommodationType,
            budget: formData.budget,
            pets: formData.pets,
            habits: formData.habits,
            cooking: formData.cooking,
          }}
          onNext={handlePreferencesSubmit}
        />
      )}

{step === 4 && (
  <div className="text-center space-y-4">
    <h2 className="text-2xl font-bold">🎉 All Set!</h2>
    <p className="text-gray-600">Here's a summary of your profile before we find your matches.</p>

    <div className="text-left text-sm bg-gray-50 p-4 rounded border">
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>

    <button
      onClick={async () => {
        try {
          const res = await fetch("/api/users/me", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              profileComplete: true,
            }),
          });

          if (!res.ok) throw new Error("Failed to update user");

          window.location.href = "/home"; // redirect to dashboard
        } catch (err) {
          console.error("Error submitting form:", err);
        }
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      🔍 Find My Matches
    </button>
  </div>
)}

    </div>
  );
}
