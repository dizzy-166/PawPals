


 export const Load = ({ size = 'medium', color = '#3498db' }) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div className="spinner-container">
      <div 
        className="spinner" 
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderColor: `${color} transparent transparent transparent`
        }}
      />
    </div>
  );
};
