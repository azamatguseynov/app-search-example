import React from 'react';
import { Link } from 'react-router-dom';

export const LinkOrText: React.FC<{ link?: string; linkClass?: string; textClass?: string }> = ({
  link,
  children,
  linkClass,
  textClass,
}) =>
  link ? (
    <Link to={link} className={linkClass}>
      {children}
    </Link>
  ) : (
    <span className={textClass}>{children}</span>
  );
