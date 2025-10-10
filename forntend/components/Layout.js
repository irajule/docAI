import React from "react";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/app">Doc Analysis</Button>
          <Button color="inherit" component={Link} to="/match-candidates">CV Screener</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
