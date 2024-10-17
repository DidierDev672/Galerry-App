import React, { useState } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  Typography,
  Card,
  Space,
  message,
} from "antd";
import { RcFile } from "antd/es/upload";
import { supabase } from "../services/supabaseClient";
import { VideoCameraOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Video: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const optimizedVide = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
   const videoElement = document.createElement('video');
    const canvasElement = document.createElement('canvas');
    const context = canvasElement.getContext('2d');

    videoElement.src = URL.createObjectURL(file);
    videoElement.muted = true;

    videoElement.onloadedmetadata = () => {
      // Ajustar el tamaño del canvas
      canvasElement.width = videoElement.videoWidth / 2; // Reducir a la mitad
      canvasElement.height = videoElement.videoHeight / 2; // Reducir a la mitad

      const stream = canvasElement.captureStream(30); // Captura a 30 fps
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const optimizedVideoBlob = new Blob(chunks, { type: 'video/webm' });
        const optimizedVideoFile = new File([optimizedVideoBlob], `optimized_${file.name}`, { type: 'video/webm' });
        resolve(optimizedVideoFile); // Resolvemos la promesa con el archivo optimizado
      };

      mediaRecorder.start();
      videoElement.play();

      const drawFrame = () => {
        context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        requestAnimationFrame(drawFrame);
      };

      drawFrame();

      videoElement.onended = () => {
        mediaRecorder.stop(); // Detener la grabación cuando el video termina
      };
    };

    videoElement.onerror = (error) => {
      reject(new Error('Error al cargar el video: ' + error));
    };
  });
};

  const onFinish = async () => {
    if (fileList.length === 0) {
      message.error("Por favor, selecciona un video");
      return;
    }

    setUploading(true);

    try {
      const file = fileList[0];


      const optimizedFile = await optimizedVide(file);

      if (!optimizedFile) {
        throw new Error("Error al optimizar el video");
      }

      const fileText = optimizedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileText}`;
      const filePath = fileName;

      // Subir el video a Supabase Storage.
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, optimizedFile);

      if (uploadError) {
        throw uploadError;
      }

      message.success("Video subido exitosamente");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Error al subir el video", error);
      message.error("Error al subir el video");
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isVideo = file.type.startsWith("video/");
    if (!isVideo) {
      message.error("Solo se permiten videos");
    }
    const isLt50M = file.size / 1024 / 1024 < 500; // Limitar a 500MB
    if (!isLt50M) {
      message.error("El tamaño del video debe ser menor a 500MB");
    }

    return isVideo && isLt50M;
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography>
          <Title level={2}>Subir un nuevo video</Title>
          <Paragraph>
            Comparte tus videos con la comunidad. Sube un video, dale un título
            y describe el contenido.
          </Paragraph>
        </Typography>

        <Form form={form} name="video" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Titulo"
            rules={[
              { required: true, message: "Por favor  ingresa un titulo" },
            ]}
          >
            <Input placeholder="Ej: Mi viaje a la playa" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            rules={[
              { required: true, message: "Por favor ingresa una descripción" },
            ]}
          >
            <Input.TextArea
              placeholder="Describe el contenido del video"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="video"
            label="Video"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <div>
              <Upload
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={(info) => {
                  const newFileList = info.fileList.map(
                    (file) => file.originFileObj as RcFile
                  );
                  setFileList(newFileList);
                }}
              >
                <Button icon={<VideoCameraOutlined />}>Seleccionar video</Button>
              </Upload>
              { uploading && <div>Subiendo video...</div> }
            </div>
         </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading}>
              Subir Video
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default Video;
