import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  alpha,

} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Logout as LogoutIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { ResponsiveContainer } from 'recharts'; // Keep this if you still need it


// Sample expense categories with colors
const CATEGORIES = [
  { name: 'Food', color: '#4caf50' },
  { name: 'Transport', color: '#2196f3' },
  { name: 'Housing', color: '#ff9800' },
  { name: 'Entertainment', color: '#9c27b0' },
  { name: 'Shopping', color: '#f44336' },
  { name: 'Bills', color: '#795548' },
  { name: 'Other', color: '#607d8b' }
];

// API URL for json-server
const API_URL = 'https://my-json-server.typicode.com/Haleem001/expense-tracker';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Fetch expenses from json-server
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${API_URL}/expenses?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        
        // Sort expenses by date (newest first)
        const sortedExpenses = data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setExpenses(sortedExpenses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        showSnackbar('Failed to load expenses', 'error');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user.id]);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  // Get category color
  const getCategoryColor = (categoryName) => {
    const category = CATEGORIES.find(cat => cat.name === categoryName);
    return category ? category.color : '#607d8b'; // Default to gray
  };
  
  // Get today's expenses
  const todayExpenses = expenses.filter(expense => 
    expense.date === format(new Date(), 'yyyy-MM-dd')
  ).reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  // Get this month's expenses
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
    })
    .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  // Get last month's expenses
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const lastMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
    })
    .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  // Calculate month-over-month change
  const monthlyChange = lastMonthExpenses === 0 
    ? 100 
    : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  // Prepare data for pie chart
  const categoryData = CATEGORIES.map(category => {
    const amount = expenses
      .filter(expense => expense.category === category.name)
      .reduce((sum, expense) => {
        // Ensure expense.amount is a number
        const expenseAmount = parseFloat(expense.amount || 0);
        return sum + expenseAmount;
      }, 0);
    
    return {
      name: category.name,
      value: amount, // This should be a number
      color: category.color
    };
  }).filter(item => item.value > 0);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewExpense({
      category: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    });
  };

  const handleAddExpense = async () => {
    try {
      // Add user ID to the expense if you want to track which user created it
      const expenseToAdd = {
        ...newExpense,
        userId: user?.id,
        amount: parseFloat(newExpense.amount),
        createdAt: new Date().toISOString()
      };
      
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseToAdd),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
      
      const savedExpense = await response.json();
      setExpenses([savedExpense, ...expenses]);
      handleCloseDialog();
      showSnackbar('Expense added successfully!', 'success');
    } catch (err) {
      console.error('Error adding expense:', err);
      showSnackbar('Failed to add expense', 'error');
    }
  };

  const currencySymbol = '₦'; // Nigerian Naira symbol
  
  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      
      setExpenses(expenses.filter(expense => expense.id !== id));
      showSnackbar('Expense deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting expense:', err);
      showSnackbar('Failed to delete expense', 'error');
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: alpha(theme.palette.primary.main, 0.03), minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }} data-testid="expense-tracker">
              Expense Tracker
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: theme.palette.secondary.main, 
              mr: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.name || 'User'}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              startIcon={<LogoutIcon />}
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.1)
                }
              }}
            data-testid="logout-button"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid size={3}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom >
                      Total Expenses
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }} data-testid="total-expenses">
                      {currencySymbol}{totalExpenses.toFixed(2)}
                    </Typography>
                    <Typography color="textSecondary">
                      All time
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main, 
                    width: 56, 
                    height: 56,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <MoneyIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={3}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Today's Expenses
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {currencySymbol}{todayExpenses.toFixed(2)}
                    </Typography>
                    <Typography color="textSecondary">
                      {format(new Date(), 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    color: theme.palette.success.main, 
                    width: 56, 
                    height: 56,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <CalendarIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={3}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      This Month
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {currencySymbol}{thisMonthExpenses.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography color="textSecondary">
                        {format(new Date(), 'MMMM yyyy')}
                        </Typography>
                      {lastMonthExpenses > 0 && (
                        <Chip 
                          icon={monthlyChange >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                          label={`${Math.abs(monthlyChange).toFixed(1)}%`}
                          size="small"
                          color={monthlyChange >= 0 ? "error" : "success"}
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1), 
                    color: theme.palette.info.main, 
                    width: 56, 
                    height: 56,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <CategoryIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
                  {/* Recent Expenses */}
                  <Grid size={6}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Expenses
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/all-expenses')}
                    sx={{ 
                      borderRadius: 8,
                      px: 2
                    }}
                  >
                    View All
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{ 
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      px: 2
                    }}
                  data-testid="add-expense-button"
                  >
                    Add  Expense
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {expenses.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 5, 
                  bgcolor: alpha(theme.palette.background.paper, 0.5), 
                  borderRadius: 2,
                  border: `1px dashed ${alpha(theme.palette.text.primary, 0.1)}`
                }}>
                  <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                    No expenses yet. Add your first expense!
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{ borderRadius: 8 }}
                  >
                    Add Expense
                  </Button>
                </Box>
              ) : (
                <List sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.5), 
                  borderRadius: 2,
                  maxHeight: categoryData.length > 0 ? 400 : 600,
                  overflow: 'auto'
                }}>
                  {expenses.map((expense) => (
                    <ListItem 
                      key={expense.id} 
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteExpense(expense.id)}
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1)
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      divider
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <Box sx={{ 
                        width: 4, 
                        height: 40, 
                        bgcolor: getCategoryColor(expense.category),
                        borderRadius: 4,
                        mr: 2
                      }} />
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {expense.description}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip 
                              label={expense.category} 
                              size="small" 
                              sx={{ 
                                bgcolor: `${getCategoryColor(expense.category)}20`,
                                color: getCategoryColor(expense.category),
                                mr: 1,
                                fontWeight: 500,
                                borderRadius: 1
                              }} 
                            />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(expense.date), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                        }
                      />
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold', 
                        mr: 2, 
                        color: theme.palette.text.primary,
                        minWidth: '100px',
                        textAlign: 'right'
                      }}>
                        {currencySymbol}{parseFloat(expense.amount).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
          
          {/* Category Distribution Chart */}
          {categoryData.length > 0 && (
            <Grid size={6}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Spending by Category
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
  <PieChart
    series={[
      {
        data: categoryData.map((category, index) => ({
          id: index,
          value: category.value,
         label: category.name,
          color: category.color
        })),
        
        highlightScope: { faded: 'global', highlighted: 'item' },
        
         
        arcLabel: (item) => {
          // Make sure item.value is a number and totalExpenses is not zero
          if (typeof item.value === 'number' && totalExpenses > 0) {
            return ` (${((item.value / totalExpenses) * 100).toFixed(0)}%)`
          }
          return `${item.label} (0%)`
        },
        arcLabelMinAngle: 20,
      },
    ]}
    width={200}
    height={200}

    tooltip={{ trigger: 'item' }}
    slotProps={{
      legend: { hidden: true }
    }}
  />
</Box>
                <Box sx={{ mt: 2 }}>
                  {categoryData.map((category) => (
                    <Box key={category.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: category.color,
                          mr: 1 
                        }} 
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {currencySymbol}{category.value.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
          
  
        </Grid>
      </Container>
      
      {/* Add Expense Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Category"
            name="category"
            placeholder='Category'
            value={newExpense.category}
            onChange={handleInputChange}
            fullWidth
            data-testid="category-select"
            margin="normal"
            sx={{ mt: 2 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          >
            {CATEGORIES.map((category) => (
              <MenuItem key={category.name} value={category.name}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: category.color,
                      mr: 1 
                    }} 
                  />
                  {category.name}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Amount"
            name="amount"
            type="number"
            placeholder='Amount'
            value={newExpense.amount}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: <Typography sx={{ mr: 0.5 }}>{currencySymbol}</Typography>,
              sx: { borderRadius: 2 }
            }}
          />
          
          <TextField
            label="Date"
            name="date"
            type="date"
            value={newExpense.date}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          <TextField
            label="Description"
            name="description"
          
            value={newExpense.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            placeholder="Description"
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined" 
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddExpense} 
            variant="contained"
            disabled={!newExpense.category || !newExpense.amount || !newExpense.date || !newExpense.description}
            sx={{ 
              borderRadius: 2, 
              ml: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;

