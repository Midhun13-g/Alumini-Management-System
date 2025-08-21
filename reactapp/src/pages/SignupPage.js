// Import React hooks and components
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '../services/AuthService';

function SignupPage() {
  // State for form data, includes all possible fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'ALUMNI',  // Default to ALUMNI
    graduationYear: '',
    industry: '',
    skills: '',
    bio: '',
    isMentor: false,
    linkedinUrl: '',
    studentId: '',
    department: '',
    yearOfJoining: '',
  });
  const [error, setError] = useState('');  // State for error messages
  const navigate = useNavigate();  // Hook for programmatic navigation

  // Handles input changes, updates formData
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;  // Handles checkbox differently
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevents default form submit
    // Basic validation for common fields
    if (!formData.email.includes('@') || formData.password.length < 6) {
      setError('Invalid email or password (min 6 chars)');
      return;
    }
    if (!formData.firstName || !formData.lastName) {
      setError('First and last name are required');
      return;
    }
    // Additional validation based on userType
    if (formData.userType === 'ALUMNI' && !formData.graduationYear) {
      setError('Graduation year required for alumni');
      return;
    }
    if (formData.userType === 'STUDENT' && (!formData.studentId || !formData.yearOfJoining)) {
      setError('Student ID and year of joining required for students');
      return;
    }
    try {
      await AuthService.signup(formData);  // Calls API with form data
      navigate('/login');  // Redirects to login on success
    } catch (err) {
      setError(err.message);  // Sets error from API
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}  // Initial animation state
      animate={{ opacity: 1, y: 0 }}  // Animate to visible
      transition={{ duration: 0.5 }}  // Animation duration
      className="min-h-screen flex items-center justify-center bg-gray-100"  // Tailwind classes for layout/styling
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"> {/* Container for form */}
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2> {/* Form title */}
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Displays error if present */}
        <form onSubmit={handleSubmit}> {/* Form element with submit handler */}
          {/* Common Fields */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"  // Styling and focus effect
              required  // Browser validation
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALUMNI">Alumni</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          {/* Conditional Fields with Animation */}
          {formData.userType === 'ALUMNI' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}  // Smooth show/hide animation
            >
              <div className="mb-4">
                <label className="block text-gray-700">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isMentor"
                    checked={formData.isMentor}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Willing to be a Mentor
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>
          )}
          {formData.userType === 'STUDENT' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Year of Joining</label>
                <input
                  type="number"
                  name="yearOfJoining"
                  value={formData.yearOfJoining}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"  // Button styling with hover effect
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            {/* Link to login */}
            Log in
          </a>
        </p>
      </div>
    </motion.div>
  );
}

export default SignupPage;