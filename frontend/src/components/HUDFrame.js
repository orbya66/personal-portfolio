import './HUDStyles.css';

function HUDFrame({ children, className }) {
  return (
    <div className={`hud-frame ${className || ''}`}>
      <div className="hud-content">{children}</div>
    </div>
  );
}

export default HUDFrame;
