
"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function CreateNewJobModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

const [formData, setFormData] = useState({
  title: "",
  company: "",
  location: "",
  type: "",
  salary: "",
  description: "",
  requirements: "",
});
  return (
    <>
        {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
      >
        + Create Job
      </button>
      {
        isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Job</h2>
              {/* Job Creation Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle job creation logic here
                  setIsModalOpen(false);
                  router.refresh(); // Refresh the page to show the new job
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label   >
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Type
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>    
                  </div>
                  <textarea
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  ></textarea>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </div>  
        )
      }
    </>
  )
}

