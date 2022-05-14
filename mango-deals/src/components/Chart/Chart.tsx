import React, { useRef, useState, useEffect } from 'react';
import './Chart.css';

type ChartProps = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  unitsPerTickX: number;
  unitsPerTickY: number;
  data?: {
    x: number;
    y: number;
  }[];
};

function Chart(props: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  // const [rangeX, setRangeX] = useState<number>(0);
  // const [rangeY, setRangeY] = useState<number>(0);
  const [numXTicks, setNumXTicks] = useState<number>(0);
  const [numYTicks, setNumYTicks] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (chartRef.current) {
      setCtx(chartRef.current.getContext('2d'));
      // setRangeX(props.maxX - props.minX);
      // setRangeY(props.maxY - props.minY);
      setNumXTicks(Math.round((props.maxX - props.minX) / props.unitsPerTickX));
      setNumYTicks(Math.round((props.maxY - props.minY) / props.unitsPerTickY));
      setWidth(
        props.maxX - props.minX < window.innerWidth
          ? window.innerWidth
          : props.maxX - props.minX
      );
      setHeight(chartRef.current.height);
    }
  }, [chartRef, props]);

  useEffect(() => {
    let drag = false;
    let offsetX = 0;
    const draw = () => {
      const context = ctx as CanvasRenderingContext2D;
      context.save();
      context.translate(offsetX, 0);
      context.clearRect(-offsetX, -0, window.innerWidth, 285);
      context.strokeStyle = '#C7CCD9';
      context.lineWidth = 1;
      context.globalAlpha = 0.05;
      // draw tick marks
      for (let n = 0; n < numXTicks; n++) {
        context.beginPath();
        context.moveTo(((n + 1) * width) / numXTicks, height);
        context.lineTo(((n + 1) * width) / numXTicks, 0);
        context.stroke();
      }
      for (let n = 0; n < numYTicks; n++) {
        context.beginPath();
        context.moveTo(0, (n * height) / numYTicks);
        context.lineTo(width, (n * height) / numYTicks);
        context.stroke();
      }
      context.restore();
    };
    if (ctx) {
      window.requestAnimationFrame(draw);
      window.addEventListener('resize', () => {
        setCanvasWidth(window.innerWidth);
        window.requestAnimationFrame(draw);
      });
      chartRef.current?.addEventListener('mousedown', () => (drag = true));
      chartRef.current?.addEventListener('mouseup', () => (drag = false));
      chartRef.current?.addEventListener('mouseleave', () => (drag = false));
      chartRef.current?.addEventListener('mousemove', (e: MouseEvent) => {
        if (drag) {
          offsetX = offsetX + e.movementX;
          if (offsetX > 0) offsetX = 0;
          if (offsetX < canvasWidth - width) offsetX = canvasWidth - width;
          window.requestAnimationFrame(draw);
        }
      });
    }
  }, [ctx, props, height, width, numXTicks, numYTicks]);

  return (
    <canvas className="Chart" ref={chartRef} width={canvasWidth} height={285}>
      Canvas not supported.
    </canvas>
  );
}

export default Chart;
