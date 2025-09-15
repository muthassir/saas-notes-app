import { useState } from 'react';
import { upgradeTenant } from '../api/api'; // use this instead of axios
import { useNavigate } from 'react-router-dom';

const Upgrade = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    try {
      const tenantSlug = localStorage.getItem('tenantSlug');
      const res = await upgradeTenant(tenantSlug);

      // Backend should return updated tenant { message, plan }
      setMessage(res.data.message || 'Plan upgraded successfully');

      // update frontend plan immediately
      if (res.data.plan) {
        localStorage.setItem('plan', res.data.plan);
      } else {
        localStorage.setItem('plan', 'pro'); // fallback
      }

    } catch (err) {
      setMessage(err.response?.data?.message || 'Upgrade failed');
    }
  };

  // Only allow Admins
  const role = localStorage.getItem('role');
  if (role !== 'admin') {   // lowercase, matches your seeding
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">Access denied: Admins only</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        <h2 className="text-xl mb-4">Upgrade Plan</h2>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <button
          onClick={handleUpgrade}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
};

export default Upgrade;
