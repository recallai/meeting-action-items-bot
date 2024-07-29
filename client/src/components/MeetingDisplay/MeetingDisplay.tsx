import React, { useState, useEffect } from "react";
import { MeetingState } from "../../constants";
import "./MeetingDisplay.css";
import ActionItems from "../ActionItems/ActionItems";

type TActionItem = {
  user: string;
  action_items: string[];
};

type TMeetingDisplayProps = {
  meetingState: MeetingState;
  setMeetingState: (meetingState: MeetingState) => void;
  meetingError: string;
  setMeetingError: (meetingError: string) => void;
};

const MeetingDisplay: React.FC<TMeetingDisplayProps> = ({
  meetingState,
  setMeetingState,
  meetingError,
  setMeetingError,
}) => {
  const [actionItems, setActionItems] = useState<TActionItem[]>([]);
  const currentDate = new Date()
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .replace(",", "");

  // listen for action items being sent from the server
  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/api/events`
    );

    eventSource.onmessage = (event) => {
      const meetingData = JSON.parse(event.data);
      if (meetingData.error) {
        setMeetingError(meetingData.error);
        setMeetingState(MeetingState.ERROR);
      } else {
        setActionItems(meetingData);
        setMeetingState(MeetingState.FINISHED);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setMeetingError("Error receiving SSE");
      setMeetingState(MeetingState.ERROR);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  let displayMessage;

  switch (meetingState) {
    case MeetingState.NOT_STARTED:
      displayMessage = "Please enter a meeting link.";
      break;
    case MeetingState.ERROR:
      displayMessage = meetingError;
      break;
    case MeetingState.LISTENING:
      displayMessage = "Meeting recording in progress...";
      break;
    default:
      displayMessage = "";
      break;
  }

  return (
    <div className="MeetingDisplay">
      {meetingState === MeetingState.FINISHED && (
        <h1 className="MeetingDisplay--header">Meeting Action Items</h1>
      )}
      <div className="MeetingDisplay--banner">
        <div className="MeetingDisplay--icon">
          <img src="../assets/octicon_calendar-24.svg" />
          {meetingState === MeetingState.FINISHED ? (
            <p>{currentDate}</p>
          ) : (
            <p>-</p>
          )}
        </div>
        <div className="MeetingDisplay--icon">
          <img src="../assets/octicon_people-24.svg" />
          {meetingState === MeetingState.FINISHED ? (
            <p>{actionItems.length}</p>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
      <div className="MeetingDisplay--display">
        {actionItems.length > 0 && meetingState === MeetingState.FINISHED ? (
          <ActionItems actionItems={actionItems} />
        ) : (
          <p
            className={`MeetingDisplay--message ${
              meetingState === MeetingState.ERROR ? "error" : ""
            }`}
          >
            {displayMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default MeetingDisplay;
