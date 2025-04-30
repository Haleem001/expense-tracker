import { TextField, Button, Alert, Box, Typography, InputAdornment, IconButton, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isAuthenticated } = useSelector(state => state.auth);

  // Add useEffect to handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting login with:', formData);
    dispatch(login(formData));
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        width: { xs: '90%', sm: 400 }, 
        mx: 'auto', 
        mt: 8,
        overflow: 'hidden'
      }}
    >
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ p: 3 }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Login to Expense Tracker
        </Typography>
        
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          fullWidth
          margin="normal"
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            sx: { borderRadius: 1 }
          }}
        />
        
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          fullWidth
          margin="normal"
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            sx: { borderRadius: 1 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ 
            mt: 3, 
            mb: 2, 
            py: 1.2,
            borderRadius: 1
          }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              style={{ 
                textDecoration: 'none', 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;
