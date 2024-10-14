import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <div className='logo' />
                <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
                    <Menu.Item key='1' icon={<HomeOutlined />}>
                        Inicio
                    </Menu.Item>
                    <Menu.Item key='2' icon={<UserOutlined />}>
                      Perfil
                    </Menu.Item>
                    <Menu.Item key='3' icon={<SettingOutlined />}>
                      Configuración
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className='site-layout'>
                <Header className='site-layout-background' style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <div className='site-layout-background' style={{ padding: 24, minHeight: 360}}>
                       { children }
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Mi Aplicación ©2024 Created con Ant Design
                </Footer>
            </Layout>
        </Layout>
    );
}


export default MainLayout;
