import { useEffect, useState } from "react";
import { Typography,Layout, Card, Col, Row, Image, Spin, Skeleton, Empty, Pagination, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { supabase } from "../services/supabaseClient";

const {  Title, Paragraph } = Typography;
const { Content } = Layout;

interface Photo {
    id: string;
    title: string;
    description: string;
    image_url: string;
}

const Home = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .storage
                .from('photos')
                .list();

            if (error) {
                throw error;
            }

            if (data) {
                const photosWithUrls = await Promise.all(data.map(async (photo) => {
                    const { data: urlData } = supabase
                        .storage
                        .from('photos')
                        .getPublicUrl(photo.name);


                    return {
                        id: photo.id,
                        title: photo.name,
                        description: photo.owner,
                        image_url: urlData.publicUrl
                    }
                }));

                //Filtrar fotos sin URL de imagen
                const validPhotos = photosWithUrls.filter((photo) => photo.title !== '.emptyFolderPlaceholder');
                setPhotos(validPhotos);

            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

    if (loading) {
        return <Spin size="large" fullscreen={true} />;
    }


    return (
        <Layout>
            <Content style={{ padding: '0 50px', marginBottom: 64 }}>
                <Title level={2}>Galería de Fotos</Title>
                <Paragraph>
                    Explora nuestra colección de imágenes compartidas por la comunidad.
                    Encuentra inspiración y comparte tus propios momentos especiales.
                </Paragraph>

                <Input
                    placeholder="Buscar fotos por título o descripción"
                    prefix={<SearchOutlined />}
                    style={{ marginBottom: 16 }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading ? (
                    <Row gutter={[16, 16]}>
                        {[...Array(4)].map((_, index) => (
                            <Col xs={24} md={8} lg={6} key={index}>
                                <Card>
                                    <Skeleton active />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : paginatedPhotos.length > 0 ? (
                        <>
                            <Row  gutter={[16,16]}>
                                {paginatedPhotos?.map((photo) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={photo.id}>
                                            <Card
                                                hoverable
                                                cover={<Image alt={photo.title} src={photo.image_url} />}
                                                title={photo.title}>
                                                <Card.Meta description={photo.description} />

                                            </Card>
                                        </Col>
                                ))}
                            </Row>
                            <Pagination
                                current={currentPage}
                                total={filteredPhotos.length}
                                pageSize={pageSize}
                                onChange={setCurrentPage}
                                style={{ marginTop: 16, textAlign: 'center' }}
                            />
                        </>
                    ) : (
                         <Empty description="No se encontraron fotos" />
                )}
            </Content>
        </Layout>
    );
};

export default Home;
