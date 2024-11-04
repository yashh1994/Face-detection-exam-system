import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext'; // Adjust the import path as needed

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { authToken, logout } = useContext(AuthContext); // Access authToken and logout

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Call logout function from context
    handleMenuClose();
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Analysis', path: '/analysis' },
    { label: 'About', path: '/about' },
    { label: 'Help', path: '/help' },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(to right, #4b6cb7, #182848)', // Gradient background
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.3)', // Soft shadow
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          MyApp
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  color: '#FFCE44', // Hover color
                },
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Highlighted "Create Test" button */}
          <Button
            component={Link}
            to="/create-test"
            sx={{
              color: '#fff',
              fontWeight: 700,
              backgroundColor: '#FFCE44',
              borderRadius: '20px',
              padding: '6px 16px',
              ml: 2,
              transition: '0.3s',
              '&:hover': {
                backgroundColor: '#FFC107',
                transform: 'scale(1.05)',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Create Test
          </Button>

          {/* Logout Button (visible if logged in) */}
          {authToken && (
            <Button
              onClick={handleLogout}
              sx={{
                color: '#fff',
                fontWeight: 600,
                marginLeft: 2,
                '&:hover': {
                  color: '#FFCE44', // Hover color for logout
                },
              }}
            >
              Logout
            </Button>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton size="large" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {navItems.map((item) => (
              <MenuItem
                key={item.label}
                component={Link}
                to={item.path}
                onClick={handleMenuClose}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuItem
              component={Link}
              to="/create-test"
              onClick={handleMenuClose}
              sx={{
                fontWeight: 'bold',
                color: '#FFCE44',
              }}
            >
              Create Test
            </MenuItem>
            {/* Logout option for mobile view */}
            {authToken && (
              <MenuItem onClick={handleLogout} sx={{ color: '#FFCE44' }}>
                Logout
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
