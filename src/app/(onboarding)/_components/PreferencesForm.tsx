'use client';

import { useState } from 'react';

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

type Props = {
  initialData: Preferences;
  onNext: (data: Preferences) => void;
};

const PreferencesForm = ({ initialData, onNext }: Props) => {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.preferredLocation) newErrors.preferredLocation = 'Required';
    if (!form.ethnicity) newErrors.ethnicity = 'Required';
    if (!form.religion) newErrors.religion = 'Required';

    if (!form.ageRange.min || !form.ageRange.max || form.ageRange.min < 18) {
      newErrors['ageRange.min'] = 'Enter valid min age (18+)';
    }

    if (form.ageRange.max < form.ageRange.min) {
      newErrors['ageRange.max'] = 'Max age must be greater than min';
    }

    if (!form.genderPreference) newErrors.genderPreference = 'Required';
    if (!form.accommodationType) newErrors.accommodationType = 'Required';

    if (!form.budget.min || !form.budget.max) {
      newErrors['budget.min'] = 'Both budget fields are required';
    }

    if (form.budget.max < form.budget.min) {
      newErrors['budget.max'] = 'Max must be ≥ Min';
    }

    if (form.pets.hasPets && !form.pets.type.trim()) {
      newErrors['pets.type'] = 'Enter pet type';
    }

    if (!form.habits.sleepPattern) newErrors['habits.sleepPattern'] = 'Required';
    if (!form.cooking) newErrors.cooking = 'Required';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onNext(form);
  };

  const getError = (field: string) => errors[field] && (
    <p className="text-red-500 text-sm">{errors[field]}</p>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Your Preferences ✨</h2>

      {/* Preferred Location */}
      <div className="space-y-2">
        <label>Preferred Location</label>
        <select name="preferredLocation" value={form.preferredLocation} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select...</option>
          <option value="Downtown">Downtown</option>
          <option value="Uptown">Uptown</option>
          <option value="Suburbs">Suburbs</option>
        </select>
        {getError('preferredLocation')}
      </div>

      {/* Ethnicity */}
      <div className="space-y-2">
        <label>Ethnicity</label>
        <select name="ethnicity" value={form.ethnicity} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select...</option>
          <option value="Asian">Asian</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Hispanic">Hispanic</option>
          <option value="Other">Other</option>
        </select>
        {getError('ethnicity')}
      </div>

      {/* Religion */}
      <div className="space-y-2">
        <label>Religion</label>
        <select name="religion" value={form.religion} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select...</option>
          <option value="Christian">Christian</option>
          <option value="Muslim">Muslim</option>
          <option value="Hindu">Hindu</option>
          <option value="Sikh">Sikh</option>
          <option value="Atheist">Atheist</option>
          <option value="Other">Other</option>
        </select>
        {getError('religion')}
      </div>

      {/* Age Range */}
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label>Age Min</label>
          <input
            type="number"
            name="ageRange.min"
            value={form.ageRange.min}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {getError('ageRange.min')}
        </div>
        <div className="flex-1 space-y-2">
          <label>Age Max</label>
          <input
            type="number"
            name="ageRange.max"
            value={form.ageRange.max}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {getError('ageRange.max')}
        </div>
      </div>

      {/* Gender Preference */}
      <div className="space-y-2">
        <label>Gender Preference</label>
        <select name="genderPreference" value={form.genderPreference} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Any">Any</option>
        </select>
        {getError('genderPreference')}
      </div>

      {/* Accommodation Type */}
      <div className="space-y-2">
        <label>Accommodation Type</label>
        <select name="accommodationType" value={form.accommodationType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select...</option>
          <option value="Sharing in an apartment">Sharing in an apartment</option>
          <option value="Private room">Private room</option>
          <option value="Basement">Basement</option>
        </select>
        {getError('accommodationType')}
      </div>

      {/* Budget */}
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label>Budget Min</label>
          <input
            type="number"
            name="budget.min"
            value={form.budget.min}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {getError('budget.min')}
        </div>
        <div className="flex-1 space-y-2">
          <label>Budget Max</label>
          <input
            type="number"
            name="budget.max"
            value={form.budget.max}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {getError('budget.max')}
        </div>
      </div>

      {/* Pets */}
      <div className="space-y-2">
        <label>Do you have pets?</label>
        <div>
          <input type="checkbox" name="pets.hasPets" checked={form.pets.hasPets} onChange={handleChange} /> Yes
        </div>
        {form.pets.hasPets && (
          <>
            <input
              type="text"
              name="pets.type"
              placeholder="Pet type (e.g. dog, cat)"
              value={form.pets.type}
              onChange={handleChange}
              className="block w-full p-2 mt-2 border rounded"
            />
            {getError('pets.type')}
          </>
        )}
      </div>

      {/* Habits */}
      <div className="space-y-2">
        <label>Sleep Pattern</label>
        <select name="habits.sleepPattern" value={form.habits.sleepPattern} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select...</option>
          <option value="Early Bird">Early Bird</option>
          <option value="Night Owl">Night Owl</option>
        </select>
        {getError('habits.sleepPattern')}
      </div>

      <div className="flex gap-4">
        <label>
          <input type="checkbox" name="habits.drinking" checked={form.habits.drinking} onChange={handleChange} />
          <span className="ml-2">Drinks Alcohol</span>
        </label>
        <label>
          <input type="checkbox" name="habits.smoking" checked={form.habits.smoking} onChange={handleChange} />
          <span className="ml-2">Smokes</span>
        </label>
      </div>

      {/* Cooking */}
      <div className="space-y-2">
        <label>Cooking Preference</label>
        <select name="cooking" value={form.cooking} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select...</option>
          <option value="Home-cooked">Home-cooked</option>
          <option value="Eat out">Eat out</option>
          <option value="Mixed">Mixed</option>
        </select>
        {getError('cooking')}
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Finish Onboarding
      </button>
    </form>
  );
};

export default PreferencesForm;
