'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { User, Store, ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'customer' | 'vendor' | null;

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    businessName: '',
    abn: '',
    phone: ''
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    analytics.signupRoleSelect(role ?? 'customer');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const endpoint = selectedRole === 'vendor' ? '/api/auth/create-vendor' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: selectedRole === 'vendor' ? 'business_owner' : 'customer',
          ...(selectedRole === 'vendor' && {
            business_name: formData.businessName,
            abn: formData.abn,
            phone: formData.phone
          })
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onClose();
        analytics.signupComplete(selectedRole === 'vendor' ? 'vendor' : 'customer');
        // Redirect to login page after successful signup
        window.location.href = '/auth/login';
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    }
  };

  const resetModal = () => {
    setSelectedRole(null);
    setError(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      businessName: '',
      abn: '',
      phone: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={selectedRole ? `Join as ${selectedRole === 'vendor' ? 'Creator' : 'Customer'}` : 'Join SuburbMates'}
      className="max-w-lg"
    >
      {!selectedRole ? (
        // Role Selection
        <div className="space-y-4">
          <p className="text-gray-600 text-center mb-6">
            Choose how you&rsquo;d like to use SuburbMates
          </p>
          
          <div className="grid gap-4">
            <button
              onClick={() => handleRoleSelect('customer')}
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-gray-200 transition-colors">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">I&rsquo;m a Customer</h3>
                <p className="text-sm text-gray-600">Browse and purchase from local creators</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>

            <button
              onClick={() => handleRoleSelect('vendor')}
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-gray-200 transition-colors">
                <Store className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">I&rsquo;m a Creator</h3>
                <p className="text-sm text-gray-600">Build your local profile and sell digital products</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
          
          <div className="text-center pt-4">
            <button
              onClick={handleClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Already have an account? <span className="font-medium">Sign in</span>
            </button>
          </div>
        </div>
      ) : (
        // Signup Form
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {selectedRole === 'vendor' && (
            <>
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Creator / Studio Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="abn" className="block text-sm font-medium text-gray-700 mb-1">
                    ABN
                  </label>
                  <input
                    type="text"
                    id="abn"
                    name="abn"
                    value={formData.abn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Create Account
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
