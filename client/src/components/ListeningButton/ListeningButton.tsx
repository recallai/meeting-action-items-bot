import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./ListeningButton.css";

const ListeningButton = () => {
  return (
    <button className="ListeningButton">
      <div className="ListeningButton--container">
        <Spin
          indicator={
            <LoadingOutlined style={{ padding: 0, color: "#198f25" }} spin />
          }
        />
        <p className="ListeningButton--text">Listening</p>
      </div>
    </button>
  );
};

export default ListeningButton;
