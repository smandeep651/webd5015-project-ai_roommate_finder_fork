'use client';

import { useEffect, useState } from 'react';
import PreferencesForm from '../../(onboarding)/_components/PreferencesForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Preferences = {
  preferredLocation: string;
  ethnicity: string;
  religion: string;
  ageRange: { min: number; max: number };
  genderPreference: string;
  accommodationType: string;
  budget: { min: number; max: number };
  pets: { hasPets: boolean; type: string };
  habits: {
    sleepPattern: string;
    drinking: boolean;
    smoking: boolean;
  };
  cooking: string;
};

const PreferencesPage = () => {
  const { data: session, status } = useSession();
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('Session:', session);  // Debug log

    if (status === 'authenticated' && session?.user?.id) {
      fetch(`/api/preferences/${session.user.id}`)
        .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch preferences'))
        .then(data => {
          const safePreferences: Preferences = {
            preferredLocation: data?.preferredLocation ?? '',
            ethnicity: data?.ethnicity ?? '',
            religion: data?.religion ?? '',
            ageRange: data?.ageRange ?? { min: 18, max: 99 },
            genderPreference: data?.genderPreference ?? '',
            accommodationType: data?.accommodationType ?? '',
            budget: data?.budget ?? { min: 0, max: 1000 },
            pets: data?.pets ?? { hasPets: false, type: '' },
            habits: data?.habits ?? {
              sleepPattern: '',
              drinking: false,
              smoking: false
            },
            cooking: data?.cooking ?? ''
          };
          setPreferences(safePreferences);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [session, status]);

  const handleSave = async (updatedData: Preferences) => {
    try {
      const res = await fetch(`/api/preferences/${session?.user?.id}`, {
        method: 'PUT',  // switch to PATCH if partial update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Failed to update preferences');
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating preferences.');
    }
  };

  if (loading) return <div className="text-center p-10">Loading preferences...</div>;
  if (!preferences) return <div className="text-center p-10">No preferences found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PreferencesForm initialData={preferences} onNext={handleSave} />
    </div>
  );
};

export default PreferencesPage;