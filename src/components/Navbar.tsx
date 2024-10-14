import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, PictureOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';


const { Header } = Layout;

const Navbar: React.FC = () => {
    const location = useLocation();

    const headerStyle: React.CSSProperties = {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        borderRadius: '10px',
        borderBottom: '1px dotted #1890ff',
        borderTop: '1px solid #1890ff',
        borderLeft: '1px solid #1890ff',
        borderRight: '1px solid #1890ff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    };

    return (
        <Header style={headerStyle}>
            <div className='logo' />
            <Menu
                theme='dark'
                mode='horizontal'
                selectedKeys={[location.pathname]}
                items={[
                    {
                        key: '/',
                        icon: <HomeOutlined />,
                        label: <Link to='/'>Inicio</Link>
                    },
                    {
                        key: '/photo',
                        icon: <PictureOutlined />,
                        label: <Link to='/photo'>Fotos</Link>
                    }
                ]}
            >
            </Menu>
        </Header>
    );
};

export default Navbar;
