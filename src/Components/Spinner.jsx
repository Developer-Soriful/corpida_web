const Spinner = ({ size = 'medium', text = 'Loading...', showText = true, className = '', fullScreen = true }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : ''} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div
          className={`
            ${sizeClasses[size]} 
            border-current border-t-transparent rounded-full animate-spin
          `}
        />
        {showText && (
          <p className="text-[14px] font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
