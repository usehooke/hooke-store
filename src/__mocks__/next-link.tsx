import React from 'react';

export default function MockLink({ href, children }: any) {
  return <a href={href}>{children}</a>;
}
