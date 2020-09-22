import * as React from 'react';

export const APISymbolFormat = ({ reference, member, type }) => {
  return (
    <span className={`api-symbol ${type}`}>
      {reference}
      {member ? `.${member}` : ''}
    </span>
  );
};

export const APIReference = ({ reference, type, overrideUrl, member }) => {
  const suffix = member ? `#${member.toLowerCase()}` : '';
  const href =
    type === 'interface'
      ? `/docs/api/interfaces/${reference.toLowerCase()}${suffix}`
      : type === 'class'
      ? `/docs/api/classes/${reference.toLowerCase()}${suffix}`
      : type === 'enum'
      ? `/docs/api/enums/${reference.toLowerCase()}${suffix}`
      : `/docs/api/index#${reference.toLowerCase()}`;
  return (
    <a className={`api-ref api-symbol ${type}`} href={overrideUrl || href}>
      {reference}
      {member ? `.${member}` : ''}
    </a>
  );
};
