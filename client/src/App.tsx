import { useState } from "react";
import Header from "./components/Header/Header";
import MeetingDispatcher from "./components/MeetingDispatcher/MeetingDispatcher";
import MeetingDisplay from "./components/MeetingDisplay/MeetingDisplay";
import { MeetingState } from "./constants";
import "./App.css";

function App() {
  const [meetingState, setMeetingState] = useState(MeetingState.NOT_STARTED);
  const [meetingError, setMeetingError] = useState("");

  return (
    <div className="App">
      <Header />
      <MeetingDispatcher
        meetingState={meetingState}
        setMeetingState={setMeetingState}
        setMeetingError={setMeetingError}
      />
      <MeetingDisplay
        meetingState={meetingState}
        setMeetingState={setMeetingState}
        meetingError={meetingError}
        setMeetingError={setMeetingError}
      />
    </div>
  );
}

export default App;
