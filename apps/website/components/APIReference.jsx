import * as React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

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
      : `/docs/api#${reference.toLowerCase()}`;
  return (
    <a
      className={`api-ref api-symbol ${type}`}
      href={useBaseUrl(overrideUrl || href)}>
      {reference}
      {member ? `.${member}` : ''}
    </a>
  );
};
