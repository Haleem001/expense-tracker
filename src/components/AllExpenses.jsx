import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  Button,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Search as SearchIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Sample expense categories with colors (same as in Dashboard)
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

const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const currencySymbol = '₦'; // Nigerian Naira symbol

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
        setFilteredExpenses(sortedExpenses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        showSnackbar('Failed to load expenses', 'error');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user.id]);

  // Apply filters when search term, category filter, or date filter changes
  useEffect(() => {
    let result = [...expenses];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(expense => 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(expense => expense.category === categoryFilter);
    }
    
    // Apply date range filter
    if (dateFilter.startDate) {
      result = result.filter(expense => 
        new Date(expense.date) >= new Date(dateFilter.startDate)
      );
    }
    
    if (dateFilter.endDate) {
      result = result.filter(expense => 
        new Date(expense.date) <= new Date(dateFilter.endDate)
      );
    }
    
    setFilteredExpenses(result);
    setPage(0); // Reset to first page when filters change
  }, [expenses, searchTerm, categoryFilter, dateFilter]);

  // Get category color
  const getCategoryColor = (categoryName) => {
    const category = CATEGORIES.find(cat => cat.name === categoryName);
    return category ? category.color : '#607d8b'; // Default to gray
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    const { name, value } = event.target;
    setDateFilter({
      ...dateFilter,
      [name]: value
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDateFilter({
      startDate: '',
      endDate: ''
    });
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs navigation */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link 
            color="inherit" 
            href="/dashboard"
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Dashboard
          </Link>
          <Typography color="text.primary">All Expenses</Typography>
        </Breadcrumbs>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ borderRadius: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
      
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        mb: 4
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          All Expenses
        </Typography>
        
        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={categoryFilter}
              label="Category"
              onChange={handleCategoryFilterChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Categories</MenuItem>
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
            </Select>
          </FormControl>
          
          <TextField
            label="From"
            type="date"
            name="startDate"
            value={dateFilter.startDate}
            onChange={handleDateFilterChange}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: '150px' }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          <TextField
            label="To"
            type="date"
            name="endDate"
            value={dateFilter.endDate}
            onChange={handleDateFilterChange}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: '150px' }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          <Button 
            variant="outlined" 
            onClick={clearFilters}
            sx={{ borderRadius: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
        
        {/* Expenses Table */}
        <TableContainer component={Paper} sx={{ 
          boxShadow: 'none', 
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Table sx={{ minWidth: 650 }} aria-label="expenses table">
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No expenses found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((expense) => (
                    <TableRow
                      key={expense.id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Chip 
                          label={expense.category} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${getCategoryColor(expense.category)}20`,
                            color: getCategoryColor(expense.category),
                            fontWeight: 500,
                            borderRadius: 1
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {currencySymbol}{parseFloat(expense.amount).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteExpense(expense.id)}
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1)
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Summary Card */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Summary
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Records
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {filteredExpenses.length}
            </Typography>
            
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {currencySymbol}{filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0).toFixed(2)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Average Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {currencySymbol}{filteredExpenses.length > 0 
                ? (filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0) / filteredExpenses.length).toFixed(2) 
                : '0.00'}
            </Typography>
          </Box>
          
          {categoryFilter && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Category Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: getCategoryColor(categoryFilter) }}>
                {categoryFilter}
              </Typography>
            </Box>
          )}
          
          {dateFilter.startDate && dateFilter.endDate && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Date Range
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {format(new Date(dateFilter.startDate), 'MMM dd')} - {format(new Date(dateFilter.endDate), 'MMM dd, yyyy')}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      
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
    </Container>
  );
};

export default AllExpenses;

