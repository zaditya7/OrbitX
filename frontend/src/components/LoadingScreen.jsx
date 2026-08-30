import "./LoadingScreen.css";

function LoadingScreen({ message = "Loading Mission Control...", showWakingNote = false }) {
  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="loading-spinner" />
        <p className="loading-message">{message}</p>
        {showWakingNote && (
          <p className="loading-waking-note">
            ⏳ Waking up the server — first load after inactivity can take up to a minute.
          </p>
        )}
      </div>
    </div>
  );
}

export default LoadingScreen;