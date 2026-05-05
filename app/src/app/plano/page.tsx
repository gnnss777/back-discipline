'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PlanoPageSimple() {
  const [value, setValue] = useState('');

  return (
    <div>
      <Link href="/">Voltar</Link>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
