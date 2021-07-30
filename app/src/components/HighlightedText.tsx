import React from 'react';

interface Props {
  text: string;
  query: string;
}

export function HighlightedText({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {' '}
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === query.toLowerCase()
              ? { fontWeight: 'bolder' }
              : {}
          }
        >
          {part}
        </span>
      ))}{' '}
    </span>
  );
}
