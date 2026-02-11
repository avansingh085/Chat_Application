import React from 'react';

const PuffLoader = ({
  size = 60,
  color = "#3b82f6", // Defaulting to Modern Electric Blue
  loading = true,
  speedMultiplier = 1,
}) => {
  if (!loading) return null;

  const sizeStyle = typeof size === 'number' ? `${size}px` : size;
  const duration = 2 / speedMultiplier;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: sizeStyle, height: sizeStyle }}
    >
      <style>
        {`
          @keyframes puff {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
          }
        `}
      </style>

      {/* Ring 1 */}
      <div
        className="absolute inset-0 rounded-full border-2 border-solid opacity-0"
        style={{
          borderColor: color,
          boxShadow: `0 0 10px ${color}40`, // Subtle modern glow
          animation: `puff ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1) infinite`,
          animationDelay: '0s',
        }}
      />

      {/* Ring 2 */}
      <div
        className="absolute inset-0 rounded-full border-2 border-solid opacity-0"
        style={{
          borderColor: color,
          boxShadow: `0 0 10px ${color}40`, // Subtle modern glow
          animation: `puff ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1) infinite`,
          animationDelay: `-${duration / 2}s`,
        }}
      />
    </div>
  );
};

export default PuffLoader;