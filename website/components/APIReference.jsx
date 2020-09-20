import * as React from 'react';

export const APIReference = ({ reference, type, overrideUrl, member }) => {
  const suffix = member ? `#${member.toLowerCase()}` : '';
  const href =
    type === 'interface'
      ? `/docs/api/interfaces/${reference.toLowerCase()}${suffix}`
      : type === 'class'
      ? `/docs/api/classes/${reference.toLowerCase()}${suffix}`
      : type === 'enum'
      ? `/docs/api/enums/${reference.toLowerCase()}${suffix}`
      : type === 'variable'
      ? `/docs/api/index#const-${reference.toLowerCase()}`
      : `/docs/api/index#${reference.toLowerCase()}`;
  return (
    <a className={`api-ref ${type}`} href={overrideUrl || href}>
      {reference}
      {member ? `.${member}` : ''}
    </a>
  );
};
