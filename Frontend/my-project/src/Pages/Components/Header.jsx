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
    { label: 'Home', path: '/home' },
    { label: 'Analysis', path: '/analysis' },
    { label: 'About', path: '/about' },
    { label: 'Help', path: '/help' },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(to right, #1a237e, #0d1b2a)', // Gradient with blue and black tones
        boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.3)', // Subtle shadow for a modern look
        transition: 'background 0.3s ease', // Smooth background transition
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
            color: '#fff', // White text for the app name
          }}
        >
          MyApp
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  color: '#90caf9', // Light blue hover color
                  transform: 'scale(1.05)', // Slight scaling effect
                  transition: 'transform 0.2s ease', // Smooth scaling transition
                },
                transition: '0.3s', // Smooth transition on hover
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
              backgroundColor: '#1e2a47', // Dark blue for Create Test button
              borderRadius: '20px',
              padding: '6px 16px',
              ml: 2,
              transition: '0.3s',
              '&:hover': {
                backgroundColor: '#0d1b2a', // Darker blue on hover
                transform: 'scale(1.05)', // Slight scaling effect
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Shadow effect on hover
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
                  color: '#90caf9', // Light blue hover color for logout
                },
                transition: '0.3s', // Smooth transition
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
                sx={{
                  color: '#1a237e', // Dark blue color for menu items
                  '&:hover': {
                    color: '#90caf9', // Light blue on hover for menu items
                  },
                  transition: '0.2s', // Smooth transition
                }}
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
                color: '#90caf9', // Light blue for "Create Test" in the menu
                '&:hover': {
                  color: '#90caf9', // Hover effect for "Create Test" in the menu
                },
              }}
            >
              Create Test
            </MenuItem>
            {/* Logout option for mobile view */}
            {authToken && (
              <MenuItem onClick={handleLogout} sx={{ color: '#90caf9' }}>
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
