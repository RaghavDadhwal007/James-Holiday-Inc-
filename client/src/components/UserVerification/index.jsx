import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserVerification = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/users/verifyUser?token=${token}`, {
          method: 'GET',
        });

        const result = await response.json();
        if (result.success) {
          setStatus('Verification successful! Redirecting to login...');
          setTimeout(() => {
            navigate('/login'); // Redirect to login after a short delay
          }, 3000);
        } else {
          setStatus(result.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('An error occurred during verification.');
      }
    };

    verifyUser();
  }, []);

  return (
    <div className="container">
      <div className="verification-box">
        <h1>Email Verification</h1>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default UserVerification;
