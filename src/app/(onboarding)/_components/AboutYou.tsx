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
      <h2 className="text-2xl font-bold text-center text-black dark:text-white">Tell us about yourself 👋</h2>

      {/* Name */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Age</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
          min={18}
        />
        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Gender</label>
        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
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
        <label className="block font-medium text-body-sm text-dark dark:text-white">Occupation</label>
        <input
          type="text"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
        />
        {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Short Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
        />
        {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
      >
        Continue
      </button>
    </form>
  );
};

export default AboutYou;
