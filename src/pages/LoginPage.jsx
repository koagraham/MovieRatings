import LoginForm from '../components/LoginForm.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (e, formData) => {
    e.preventDefault()
    const res = await axios.post('/api/auth', formData)
    if (res) {
      navigate('/me')
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <LoginForm onLogin={handleLogin}/>
    </>
  );
}
