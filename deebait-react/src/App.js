import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';

import createTheme from '@mui/material/styles/createTheme';
import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes'
import { ThemeProvider } from '@mui/private-theming';

import Home from './components/Home.js';
import Footer from './components/Footer.js';

let theme = createTheme();
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
        <Home />
        <Footer />
      </ThemeProvider>
    </Router>
    
  );
}

export default App;
