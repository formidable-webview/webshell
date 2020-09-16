import * as React from 'react';

export const APIReference = ({ reference, type }) => {
  const href =
    type === 'interface'
      ? `/docs/api/interfaces/${reference.toLowerCase()}`
      : type === 'class'
      ? `/docs/api/classes/${reference.toLowerCase()}`
      : type === 'enum'
      ? `/docs/api/enums/${reference.toLowerCase()}`
      : type === 'variable'
      ? `/docs/api/index#const-${reference.toLowerCase()}`
      : `/docs/api/index#${reference.toLowerCase()}`;
  return (
    <a className={`api-ref ${type}`} href={href}>
      {reference}
    </a>
  );
};
