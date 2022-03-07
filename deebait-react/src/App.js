/**
 * This is the main entry-point of the application.
 * It is basically where everything starts.
 */

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import createTheme from '@mui/material/styles/createTheme';
import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes'
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import themeOptions from './Theme.js';
import Home from './components/Home.js';
import FAQ from './components/FAQ.js';

let theme = createTheme(themeOptions);
theme = responsiveFontSizes(theme);

function App() {
  return (
    <Router>
      <HelmetProvider>
          <Helmet>
          <title>Deebait</title>
          <meta name='description' content='' />
          <meta name='keywords' content='debate,fight,one,argue' />
          <meta name='author' content='Ralph Louis Gopez' />
          <meta httpEquiv='X-UA-Compatible' content='ie-edge'/>

          <meta property='og:title' content='Deebait' />
          <meta property='og:description' content='' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Deebait' />
          <meta property='og:image' content='' />
          <meta property='og:url' content='' />

          <meta property='twitter:title' content='Deebait' />
          <meta property='twitter:description' content='' />
          <meta property='twitter:image' content='' />
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:image:alt' content='Welcome to Deebait' />
        </Helmet>
      </HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Switch>
          <Route 
            exact 
            path="/see/faq" 
            children={<Box ml={3} mr={3} mt={3} mb={3}><FAQ/></Box>}>
            </Route>
          <Route path='/' children={<Home />}></Route>
        </Switch>
      </ThemeProvider>
    </Router>
    
  );
}

export default App;
