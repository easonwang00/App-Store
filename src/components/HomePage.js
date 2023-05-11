import {
  Button,
  Card,
  Form,
  Image,
  Input,
  List,
  message,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { searchApps, checkout } from "../utils";
import PostApps from "./PostApps";
import Sendbird from "./SendBird";
const { TabPane } = Tabs;
const { Text } = Typography;

const BrowseApps = ({ setActiveTabKey }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const resp = await searchApps(query);
      setData(resp || []);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (name) => {
    // set the active tab key to 3
    setActiveTabKey("3");
    sessionStorage.setItem("sellerUser", name);
  };

  return (
    <>
      <Form onFinish={handleSearch} layout="inline">
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
      <List
        style={{ marginTop: 20 }}
        loading={loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              key={item.id}
              title={
                <Tooltip title={item.description}>
                  <Text ellipsis={true} style={{ maxWidth: 150 }}>
                    {item.title}
                  </Text>
                </Tooltip>
              }
              extra={<Text type="secondary">${item.price}</Text>}
              actions={[
                <Button
                  shape="round"
                  type=""
                  onClick={() => {
                    handleButtonClick(item.user);
                  }}
                >
                  Let's Chat
                </Button>,
                <Button
                  shape="round"
                  type="primary"
                  onClick={() => checkout(item.id)}
                >
                  Checkout
                </Button>,
              ]}
            >
              <Image src={item.url} width="100%" />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

const HomePage = () => {
  const [activeTabKey, setActiveTabKey] = useState("1");

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTabKey}
        destroyInactiveTabPane={true}
        onChange={(key) => setActiveTabKey(key)}
      >
        <TabPane tab="Browse" key="1">
          <BrowseApps setActiveTabKey={setActiveTabKey} />
        </TabPane>
        <TabPane tab="Upload" key="2">
          <PostApps />
        </TabPane>
        <TabPane tab="Chat" key="3">
          <Sendbird />
        </TabPane>
      </Tabs>
    </>
  );
};

export default HomePage;
