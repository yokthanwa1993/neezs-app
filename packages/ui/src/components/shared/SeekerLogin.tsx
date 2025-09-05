import React from 'react';
import { useNavigate } from 'react-router-dom';
import LineLogin from './LineLogin';

interface SeekerLoginProps {
  onLoginSuccess?: () => void;
}

const SeekerLogin: React.FC<SeekerLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      navigate('/seeker/home');
    }
  };

  return <LineLogin onLoginSuccess={handleLoginSuccess} role="seeker" />;
};

export default SeekerLogin;