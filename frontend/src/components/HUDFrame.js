function HUDFrame({ children, className }) {
  return (
    <div className={className || ''} style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '16px', borderTop: '2px solid #FF4D00', borderLeft: '2px solid #FF4D00' }}></div>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', borderTop: '2px solid #FF4D00', borderRight: '2px solid #FF4D00' }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '16px', borderBottom: '2px solid #FF4D00', borderLeft: '2px solid #FF4D00' }}></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderBottom: '2px solid #FF4D00', borderRight: '2px solid #FF4D00' }}></div>
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </div>
  );
}

export default HUDFrame;
