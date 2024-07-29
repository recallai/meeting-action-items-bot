import React from "react";
import { AlignLeftOutlined } from "@ant-design/icons";
import "./ActionItems.css";

type TActionItem = {
  user: string;
  action_items: string[];
};

type TActionItemsProps = {
  actionItems: TActionItem[];
};

const ActionItems: React.FC<TActionItemsProps> = ({ actionItems }) => {
  return (
    <div className="ActionItems">
      {actionItems.map((item, index) => (
        <div key={index}>
          <p className="ActionItems--user">{item.user}</p>
          {item.action_items.map((actionItem, index) => (
            <div className="ActionItems--actionItem" key={index}>
              <AlignLeftOutlined
                style={{ color: "#0D6EFD", fontSize: "12px" }}
              />
              <p className="ActionItems--text">{actionItem}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ActionItems;
