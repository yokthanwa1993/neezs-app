import React from 'react';
import { useNavigate } from 'react-router-dom';
import LineLogin from './LineLogin';

interface EmployerLoginProps {
  onLoginSuccess: () => void;
}

const EmployerLogin: React.FC<EmployerLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      navigate('/employer/home');
    }
  };

  return <LineLogin onLoginSuccess={handleLoginSuccess} role="employer" />;
};

export default EmployerLogin;