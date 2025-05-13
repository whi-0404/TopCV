import React, { useState } from 'react';
import { testApiConnection, testLogin, testRegister, testSendOtp, testChangePassword } from '../utils/apiTest';
import { UserType } from '../config';
import Alert from '../components/ui/Alert';

const ApiTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loginResult, setLoginResult] = useState<any>(null);
  const [registerResult, setRegisterResult] = useState<any>(null);
  const [otpResult, setOtpResult] = useState<any>(null);
  const [changePasswordResult, setChangePasswordResult] = useState<any>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUserType, setRegisterUserType] = useState('jobseeker');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [otpEmail, setOtpEmail] = useState('');
  
  const [changePasswordEmail, setChangePasswordEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleTestConnection = async () => {
    const result = await testApiConnection();
    setConnectionStatus(result);
  };

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await testLogin(loginEmail, loginPassword);
    setLoginResult(result);
  };

  const handleTestRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const registerData = {
      email: registerEmail,
      password: registerPassword,
      userTypeId: registerUserType === 'jobseeker' ? UserType.SEEKER : UserType.COMPANY,
      firstName: registerUserType === 'jobseeker' ? firstName : undefined,
      lastName: registerUserType === 'jobseeker' ? lastName : undefined,
      companyName: registerUserType === 'company' ? companyName : undefined,
    };
    const result = await testRegister(registerData);
    setRegisterResult(result);
  };

  const handleTestSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await testSendOtp(otpEmail);
    setOtpResult(result);
  };

  const handleTestChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await testChangePassword(changePasswordEmail, otp, newPassword);
    setChangePasswordResult(result);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

      {/* Test Connection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test API Connection</h2>
        <button 
          onClick={handleTestConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Connection
        </button>
        {connectionStatus && (
          <div className="mt-4">
            <Alert 
              type={connectionStatus.success ? 'success' : 'error'} 
              message={connectionStatus.message} 
            />
          </div>
        )}
      </div>

      {/* Test Login */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Login API</h2>
        <form onSubmit={handleTestLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Login
          </button>
        </form>
        {loginResult && (
          <div className="mt-4">
            <Alert 
              type={loginResult.success ? 'success' : 'error'} 
              message={loginResult.message} 
            />
            {loginResult.success && loginResult.data && (
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-60">
                {JSON.stringify(loginResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Test Register */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Register API</h2>
        <form onSubmit={handleTestRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="jobseeker"
                  checked={registerUserType === 'jobseeker'}
                  onChange={() => setRegisterUserType('jobseeker')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Job Seeker</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="company"
                  checked={registerUserType === 'company'}
                  onChange={() => setRegisterUserType('company')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Company</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {registerUserType === 'jobseeker' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          )}
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Register
          </button>
        </form>
        {registerResult && (
          <div className="mt-4">
            <Alert 
              type={registerResult.success ? 'success' : 'error'} 
              message={registerResult.message} 
            />
            {registerResult.success && registerResult.data && (
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-60">
                {JSON.stringify(registerResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Test Send OTP */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Send OTP API</h2>
        <form onSubmit={handleTestSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Send OTP
          </button>
        </form>
        {otpResult && (
          <div className="mt-4">
            <Alert 
              type={otpResult.success ? 'success' : 'error'} 
              message={otpResult.message} 
            />
            {otpResult.success && otpResult.data && (
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-60">
                {JSON.stringify(otpResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Test Change Password */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Change Password API</h2>
        <form onSubmit={handleTestChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={changePasswordEmail}
              onChange={(e) => setChangePasswordEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Change Password
          </button>
        </form>
        {changePasswordResult && (
          <div className="mt-4">
            <Alert 
              type={changePasswordResult.success ? 'success' : 'error'} 
              message={changePasswordResult.message} 
            />
            {changePasswordResult.success && changePasswordResult.data && (
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-60">
                {JSON.stringify(changePasswordResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest; 