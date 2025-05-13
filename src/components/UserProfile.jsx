
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const UserProfile = ({ userId, onProfileUpdate }) => {
  const theme = useTheme();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currency: 'USD',
    monthlyBudget: 0,
    avatar: '',
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Mock API call - replace with actual API call
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          currency: 'USD',
          monthlyBudget: 2000,
          avatar: '',
          theme: 'light'
        };
        
        setTimeout(() => {
          setProfile(mockData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profile),
      // });
      
      // Mock successful update
      setTimeout(() => {
        setIsEditing(false);
        if (onProfileUpdate) {
          onProfileUpdate(profile);
        }
      }, 500);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System Default' }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Card elevation={3} sx={{ mt: 4, mb: 4, overflow: 'visible' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3} flexDirection={{ xs: 'column', sm: 'row' }}>
            {profile.avatar ? (
              <Avatar 
                src={profile.avatar} 
                alt={profile.name}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mr: { xs: 0, sm: 3 },
                  mb: { xs: 2, sm: 0 },
                  border: `3px solid ${theme.palette.divider}`
                }}
              />
            ) : (
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mr: { xs: 0, sm: 3 },
                  mb: { xs: 2, sm: 0 },
                  bgcolor: theme.palette.primary.main
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 60 }} />
              </Avatar>
            )}
            <Typography variant="h4" component="h1">
              {user.name}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {isEditing ? (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    type="username"
                    value={user.username}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                
             
                
             
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="theme-label">Theme</InputLabel>
                    <Select
                      labelId="theme-label"
                      id="theme"
                      name="theme"
                      value={profile.theme}
                      onChange={handleInputChange}
                      label="Theme"
                    >
                      {themeOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Avatar URL"
                    name="avatar"
                    value={profile.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      startIcon={<SaveIcon />}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={() => setIsEditing(false)}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" py={1.5} borderBottom={`1px solid ${theme.palette.divider}`}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ width: 180 }}>
                      Username:
                    </Typography>
                    <Typography variant="body1">
                      {user.username}
                    </Typography>
                  </Box>
                </Grid>
                
    
                
                <Grid item xs={12}>
                  <Box mt={3}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => setIsEditing(true)}
                      startIcon={<EditIcon />}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onProfileUpdate: PropTypes.func
};

export default UserProfile;
