import React, { useEffect, useState } from 'react';
import { Card, List, Button, Spin } from 'antd';
import { supabase } from '../services/supabaseClient';


interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
}

const ListVideo: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState<Video[]>([]);


    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
            try {
            setLoading(true);
            const { data, error } = await supabase
                .storage
                .from('videos')
                .list();

            if (error) {
                throw error;
            }

            if (data) {
                const photosWithUrls = await Promise.all(data.map(async (photo) => {
                    const { data: urlData } = supabase
                        .storage
                        .from('videos')
                        .getPublicUrl(photo.name);


                    return {
                        id: photo.id,
                        title: photo.name,
                        description: photo.owner,
                        url: urlData.publicUrl
                    }
                }));

                //Filtrar fotos sin URL de imagen
                const validPhotos = photosWithUrls.filter((photo) => photo.title !== '.emptyFolderPlaceholder');
                setVideos(validPhotos);

            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Lista de Videos</h2>
            {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={videos}
          renderItem={video => (
            <List.Item>
              <Card
                hoverable
                cover={<video src={video.url}></video>} // Asegúrate de tener una URL de miniatura
                actions={[
                  <Button type="primary" onClick={() => window.open(video.url, '_blank')}>Reproducir</Button>,
                ]}
              >
                <Card.Meta title={video.title} description={video.description} />
              </Card>
            </List.Item>
          )}
        />
      )}
        </div>
    );
};

export default ListVideo;
