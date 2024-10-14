import { useState } from "react";
import {
  Upload,
  message,
  Button,
  Form,
  Input,
  Typography,
  Card,
  Space,
} from "antd";
import { PictureOutlined, UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { supabase } from "../services/supabaseClient";

const { Title, Paragraph } = Typography;

const Photo = () => {
  const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);


    const onFinish = async () => {
    if (fileList.length === 0) {
      message.error("Por favor, selecciona una imagen");
      return;
        }

         setLoading(true);

    const file = fileList[0];
    const fileText = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileText}`;
    const filePath = `${fileName}`;

    try {
      if (!file) {
        throw new Error("No se seleccionó ninguna imagen");
      }

      // Convertir UploadFile a File si es necesario
      let fileToUpload: File;
      if (file instanceof File) {
        fileToUpload = file;
      } else if (
        "originFileObj" in file &&
        file.originFileObj instanceof File
      ) {
        fileToUpload = file.originFileObj;
      } else {
        throw new Error("El archivo seleccionado no es válido");
      }

      // Subír la imagen a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, fileToUpload);

      if (uploadError) {
        throw uploadError;
      }

      message.success("Imagen subida exitosamente");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Error al subir la imagen", error);
      message.error("Error al subir la imagen");
    } finally {
        setLoading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    setFileList([file]);
    return false;
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography>
          <Title level={2}>Subir una nueva foto</Title>
          <Paragraph>
            Comparte tus mejores momentos con la comunidad. Sube una imagen,
            dale un titulo y describe el momento capturado.
          </Paragraph>
        </Typography>

        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Titulo"
            rules={[
              { required: true, message: "Por favor, ingresa un titulo" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Imagen"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <Upload
              beforeUpload={beforeUpload}
              fileList={fileList}
                          listType="picture"
                          onChange={({ fileList }) => setFileList(fileList)}
                          onRemove={() => setFileList([])}
              maxCount={1}
            >
             {
                              fileList.length === 0 && (
                                  <div>
                                      <PictureOutlined />
                                      <div style={{ marginTop: 8 }}>Subir Foto</div>
                            </div>
                )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<UploadOutlined />} loading={loading}>
              Subir Imagen
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default Photo;
