'use client';

import { useState } from 'react';

type Props = {
  initialData: {
    name: string;
    bio: string;
    age: number;
    sex: string;
    occupation: string;
  };
  onNext: (data: Props['initialData']) => void;
};

const AboutYou = ({ initialData, onNext }: Props) => {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on input
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.bio.trim()) newErrors.bio = 'Bio is required.';
    if (!form.occupation.trim()) newErrors.occupation = 'Occupation is required.';
    if (!form.sex) newErrors.sex = 'Gender is required.';
    if (!form.age || form.age < 18) newErrors.age = 'Valid age (18 or above) is required.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onNext(form); // 🔁 pass data up to parent
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Tell us about yourself 👋</h2>

      {/* Name */}
      <div className="space-y-2">
        <label className="block font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <label className="block font-medium">Age</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min={18}
        />
        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block font-medium">Gender</label>
        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select...</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
      </div>

      {/* Occupation */}
      <div className="space-y-2">
        <label className="block font-medium">Occupation</label>
        <input
          type="text"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="block font-medium">Short Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded"
        />
        {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Continue
      </button>
    </form>
  );
};

export default AboutYou;
