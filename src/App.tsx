import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import MainLayout from './MainLayout'
import Home from './pages/Home';
import Photo from './pages/Photo';

import { createGlobalStyle } from 'styled-components';
import { ConfigProvider } from 'antd';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    font-optical-sizing: auto;
    font-style: normal;
  }
`;

const { Content } = Layout;
function App() {
  return (
    <ConfigProvider theme={{ token: { fontFamily: "'Montserrat', sans-serif" } }}>
      <Router>
      <MainLayout>
        <GlobalStyle />
        <Layout>
          <Navbar />
          <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <div className='site-layout-content' style={{ padding: 24, minHeight: 380 }}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/photo' element={<Photo />} />
              </Routes>
          </div>
          </Content>
      </Layout>
      </MainLayout>
    </Router>
    </ConfigProvider>
  );
}

export default App
