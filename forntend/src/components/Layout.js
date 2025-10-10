import React from "react";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={{ mr: 5 }}>Home</Button>
          <Button color="inherit" component={Link} to="/docqa" sx={{ mr: 5 }}>Doc Analysis</Button>
          <Button color="inherit" component={Link} to="/cvscreen" sx={{ mr: 5 }}>CV Screener</Button>
           <Button color="inherit" component={Link} to="/translate">Doc Translation</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
