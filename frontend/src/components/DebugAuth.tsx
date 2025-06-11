import React, { useState } from 'react';
import authService from '../services/authService';

const DebugAuth: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<string>('');
  
  const handleCheckToken = () => {
    const token = authService.getToken();
    if (!token) {
      setTokenInfo({ error: 'No token found in localStorage' });
      return;
    }
    
    try {
      // Decode token
      const parts = token.split('.');
      if (parts.length !== 3) {
        setTokenInfo({ error: 'Invalid token format' });
        return;
      }
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      // Extract role
      const role = payload.scope || 'No role found';
      const userType = authService.getUserType();
      const isAuthenticated = authService.isAuthenticated();
      const isExpired = authService.isTokenExpired(token);
      
      setTokenInfo({
        header,
        payload,
        role,
        userType,
        isAuthenticated,
        isExpired,
        token: token.substring(0, 20) + '...'
      });
    } catch (error) {
      setTokenInfo({ error: 'Failed to decode token' });
    }
  };
  
  const handleTestAPI = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch('http://localhost:8080/TopCV/api/v1/job-posts/my-posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      let responseText = '';
      responseText += `Status: ${response.status}\n`;
      
      if (!response.ok) {
        const errorText = await response.text();
        responseText += `Error: ${errorText}\n`;
        console.error('API Error Response:', errorText);
      } else {
        const data = await response.json();
        responseText += `Success: ${JSON.stringify(data, null, 2)}\n`;
        console.log('API Success Response:', data);
      }
      
      setApiResponse(responseText);
    } catch (error: any) {
      console.error('API Call Failed:', error);
      setApiResponse(`Error: ${error.message}`);
    }
  };
  
  const handleTestCompanyAPI = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch('http://localhost:8080/TopCV/api/v1/employers/my-company', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Company API Response Status:', response.status);
      console.log('Company API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      let responseText = '';
      responseText += `Status: ${response.status}\n`;
      
      if (!response.ok) {
        const errorText = await response.text();
        responseText += `Error: ${errorText}\n`;
        console.error('Company API Error Response:', errorText);
      } else {
        const data = await response.json();
        responseText += `Success: ${JSON.stringify(data, null, 2)}\n`;
        console.log('Company API Success Response:', data);
      }
      
      setApiResponse(responseText);
    } catch (error: any) {
      console.error('Company API Call Failed:', error);
      setApiResponse(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Authentication Debug</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button 
            onClick={handleCheckToken}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check Token
          </button>
          
          <button 
            onClick={handleTestAPI}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Job API
          </button>
          
          <button 
            onClick={handleTestCompanyAPI}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Company API
          </button>
        </div>
        
        {tokenInfo && (
          <div className="mt-4 border p-4 rounded bg-gray-50">
            <h3 className="font-medium mb-2">Token Information</h3>
            {tokenInfo.error ? (
              <div className="text-red-500">{tokenInfo.error}</div>
            ) : (
              <div>
                <div><strong>Token:</strong> {tokenInfo.token}</div>
                <div><strong>Role:</strong> {tokenInfo.role}</div>
                <div><strong>User Type:</strong> {tokenInfo.userType}</div>
                <div><strong>Authenticated:</strong> {tokenInfo.isAuthenticated ? 'Yes' : 'No'}</div>
                <div><strong>Expired:</strong> {tokenInfo.isExpired ? 'Yes' : 'No'}</div>
                <div className="mt-2">
                  <strong>Payload:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(tokenInfo.payload, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
        
        {apiResponse && (
          <div className="mt-4 border p-4 rounded bg-gray-50">
            <h3 className="font-medium mb-2">API Response</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
              {apiResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugAuth; 