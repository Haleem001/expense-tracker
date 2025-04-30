import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Alert, 
  Box, 
  Typography, 
  InputAdornment, 
  IconButton,
  CircularProgress,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../features/auth/authSlice';

const SignupForm = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '',
    name: '' 
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      username: '', 
      password: '', 
      confirmPassword: '',
      name: '' 
    };
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Create a new user object without confirmPassword
      const newUser = {
        username: formData.username,
        password: formData.password,
        name: formData.name
      };
      
      const resultAction = await dispatch(signup(newUser));
      
      if (signup.fulfilled.match(resultAction)) {
        // Signup successful, navigate to dashboard or show success message
        navigate('/dashboard');
      }
    }
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
        sx={{ 
          p: 3,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Create Your Account
        </Typography>
        
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          fullWidth
          margin="normal"
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          variant="outlined"
          autoComplete="username"
          InputProps={{
            sx: { borderRadius: 1 }
          }}
        />
        
        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          fullWidth
          margin="normal"
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          variant="outlined"
          autoComplete="name"
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
          error={!!errors.password}
          helperText={errors.password}
          variant="outlined"
          autoComplete="new-password"
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
        
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          fullWidth
          margin="normal"
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          variant="outlined"
          autoComplete="new-password"
          InputProps={{
            sx: { borderRadius: 1 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ 
            mt: 3, 
            mb: 2, 
            py: 1.2,
            borderRadius: 1,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                textDecoration: 'none', 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default SignupForm;
