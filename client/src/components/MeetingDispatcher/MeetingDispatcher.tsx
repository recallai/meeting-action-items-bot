import { useState } from "react";
import "./MeetingDispatcher.css";
import axios from "axios";
import { notification } from "antd";
import ListeningButton from "../ListeningButton/ListeningButton";
import { MeetingState } from "../../constants";

type TRecallError = {
  response: {
    data: {
      status: number;
      message: { [key: string]: string[] };
    };
  };
};

type TMeetingDispatcherProps = {
  meetingState: MeetingState;
  setMeetingState: (meetingState: MeetingState) => void;
  setMeetingError: (error: string) => void;
};

const MeetingDispatcher: React.FC<TMeetingDispatcherProps> = ({
  meetingState,
  setMeetingState,
  setMeetingError,
}) => {
  const [meetingUrl, setMeetingUrl] = useState("");

  const sendMeetingUrl = async (meetingUrl: string) => {
    // basic url validation
    try {
      new URL(meetingUrl);
    } catch (error) {
      notification.error({
        message: "Invalid URL",
        description: "Please enter a valid Zoom meeting URL.",
      });
      return;
    }

    try {
      setMeetingState(MeetingState.LISTENING);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/invite_bot`, {
        meetingUrl: meetingUrl,
      });
    } catch (error) {
      setMeetingState(MeetingState.ERROR);
      const recallError = error as TRecallError;
      const { status, message } = recallError.response.data;
      setMeetingError(`Error ${status} ${JSON.stringify(message)}`);
    }
  };

  return (
    <div className="MeetingDispatcher">
      <input
        className="MeetingDispatcher--input"
        type="text"
        value={meetingUrl}
        onChange={(e) => {
          setMeetingUrl(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMeetingUrl(meetingUrl);
          }
        }}
      />
      {meetingState !== MeetingState.LISTENING ? (
        <button
          className={`MeetingDispatcher--button ${
            meetingUrl ? "MeetingDispatcher--button--active" : ""
          }`}
          onClick={() => {
            sendMeetingUrl(meetingUrl);
          }}
        >
          Start recording
        </button>
      ) : (
        <ListeningButton />
      )}
    </div>
  );
};

export default MeetingDispatcher;
