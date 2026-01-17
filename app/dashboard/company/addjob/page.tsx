"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to post job");
      return;
    }

    router.push("/dashboard/company");
  }

  return (
    <div className="bg-zinc-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white border rounded-2xl p-8 space-y-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Post a New Job
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Frontend Developer"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Toronto, ON / Remote"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium mb-1">Salary (Optional)</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="$70,000 - $90,000"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Describe the role, responsibilities, team..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium mb-1">Requirements</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="List required skills and experience..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
