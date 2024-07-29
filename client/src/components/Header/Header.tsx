import "./Header.css";

const Header = () => {
  return (
    <div className="Header">
      <h1 className="Header--heading">Get action items from your meeting</h1>
      <p className="Header--subheading">
        Enter your current meeting link and get a list of action items at the
        end of your meeting.
      </p>
    </div>
  );
};

export default Header;
