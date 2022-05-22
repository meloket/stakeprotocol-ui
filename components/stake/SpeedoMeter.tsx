import React from 'react';
import dynamic from 'next/dynamic';

interface SpeedoMeterProps {
  value: number;
  minValue: number;
  maxValue: number;
}

const ReactSpeedometer = dynamic(
  () => import('react-d3-speedometer'),
  { ssr: false },
);

function Speedometer(props: SpeedoMeterProps) {
  const { value, minValue, maxValue } = props;
  return (
    <div>
      <ReactSpeedometer value={value} minValue={minValue} maxValue={maxValue} />
    </div>
  );
}

export default Speedometer;