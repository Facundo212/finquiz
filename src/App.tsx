import { useState } from 'react';

import { Button } from '@/components/ui/button';

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-2">
      <div>{count}</div>
      <Button onClick={() => setCount((prevCount) => prevCount + 1)}>Click me</Button>
    </div>
  );
}

export default App;
