import React, { useState } from 'react';
import jobService from '../../services/jobService';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runApiTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Test Backend Connection',
        test: async () => {
          const response = await fetch('http://localhost:8080/TopCV/api/v1/health', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          return { status: response.status, data: await response.text() };
        }
      },
      {
        name: 'Test Job Types API',
        test: async () => {
          return await jobService.getJobTypes();
        }
      },
      {
        name: 'Test Job Levels API', 
        test: async () => {
          return await jobService.getJobLevels();
        }
      },
      {
        name: 'Test Dashboard Jobs API',
        test: async () => {
          return await jobService.getDashboardJobs(1, 5);
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`🧪 Running test: ${test.name}`);
        const result = await test.test();
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'success',
          data: result
        }]);
      } catch (error: any) {
        console.error(`❌ Test failed: ${test.name}`, error);
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          error: error.message
        }]);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API Connection Test</h2>
      
      <button
        onClick={runApiTests}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 mb-6"
      >
        {isLoading ? 'Testing...' : 'Run API Tests'}
      </button>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              result.status === 'success' 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${
                result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <h3 className="font-semibold text-gray-800">{result.name}</h3>
            </div>
            
            {result.status === 'success' ? (
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <p className="text-red-600 text-sm">{result.error}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Environment Info:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>API Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:8080/TopCV'}</li>
          <li>Node ENV: {process.env.NODE_ENV}</li>
          <li>React APP ENV: {process.env.REACT_APP_ENV || 'not set'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest; 