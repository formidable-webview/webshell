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
      : type === 'type' || type === 'alias'
      ? `/docs/api/types/${reference.toLowerCase()}${suffix}`
      : type === 'function'
      ? `/docs/api/functions/${reference.toLowerCase()}${suffix}`
      : type === 'variable'
      ? `/docs/api/variables/${reference.toLowerCase()}${suffix}`
      : null;
  if (href === null) {
    throw new TypeError(
      `APIReference: ${type} must be one of 'interface', 'class', 'type', 'alias', 'function' or 'variable'.`
    );
  }
  return (
    <a
      className={`api-ref api-symbol ${type}`}
      href={useBaseUrl(overrideUrl || href)}>
      {reference}
      {member ? `.${member}` : ''}
    </a>
  );
};
