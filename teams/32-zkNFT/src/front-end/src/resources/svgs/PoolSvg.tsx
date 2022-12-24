// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

const PoolSvg = ({ className, fill }) => {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30" className={className} fill={fill}>
      <path d="M0.399902 18.6V24C0.399902 26.9823 6.04111 29.4 12.9999 29.4C19.9587 29.4 25.5999 26.9823 25.5999 24V18.6C25.5999 21.5823 19.9587 24 12.9999 24C6.04111 24 0.399902 21.5823 0.399902 18.6Z" />
      <path d="M0.399902 9.59998V15C0.399902 17.9823 6.04111 20.4 12.9999 20.4C19.9587 20.4 25.5999 17.9823 25.5999 15V9.59998C25.5999 12.5823 19.9587 15 12.9999 15C6.04111 15 0.399902 12.5823 0.399902 9.59998Z" />
      <path d="M25.5999 5.99998C25.5999 8.98231 19.9587 11.4 12.9999 11.4C6.04111 11.4 0.399902 8.98231 0.399902 5.99998C0.399902 3.01764 6.04111 0.599976 12.9999 0.599976C19.9587 0.599976 25.5999 3.01764 25.5999 5.99998Z" />
    </svg>
  );
};

PoolSvg.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
};

export default PoolSvg;
