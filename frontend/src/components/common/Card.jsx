import React from 'react';

export const Card = ({
  children,
  className = '',
  style = {},
  hoverable = true,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-base ${hoverable ? 'hoverable-card' : ''} ${className}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Card;
