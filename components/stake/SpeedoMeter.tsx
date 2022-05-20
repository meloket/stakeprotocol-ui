import React from 'react';
import dynamic from 'next/dynamic';

const ReactSpeedometer = dynamic(
  () => import('react-d3-speedometer'),
  { ssr: false },
);

function Speedometer() {
  return (
    <div>
      <ReactSpeedometer />
    </div>
  );
}

export default Speedometer;