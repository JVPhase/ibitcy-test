import React, { useRef, useState, useEffect } from 'react';
import './Chart.css';

type ChartProps = {
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
  const [rangeX, setRangeX] = useState<number>(0);
  const [rangeY, setRangeY] = useState<number>(0);
  const [numXTicks, setNumXTicks] = useState<number>(0);
  const [numYTicks, setNumYTicks] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    let drag = false;
    let offsetX = 0;
    let hoverEl = -1;
    const getLimit = (limit: 'min' | 'max', axis: 'x' | 'y') => {
      if (props.data) {
        const arr = [...props.data];
        return arr.sort((a, b) => {
          return limit === 'min' ? a[axis] - b[axis] : b[axis] - a[axis];
        })[0][axis];
      } else {
        return 0;
      }
    };
    if (chartRef.current) {
      setCtx(chartRef.current.getContext('2d'));
    }
    const draw = () => {
      setRangeX(getLimit('max', 'x') - getLimit('min', 'x'));
      setRangeY(getLimit('max', 'y') - getLimit('min', 'y'));
      setNumXTicks(
        Math.round(
          (getLimit('max', 'x') - getLimit('min', 'x') < window.innerWidth
            ? window.innerWidth
            : getLimit('max', 'x') - getLimit('min', 'x')) / props.unitsPerTickX
        )
      );
      setNumYTicks(
        Math.round(
          (getLimit('max', 'y') - getLimit('min', 'y') < 285
            ? 285
            : getLimit('max', 'y') - getLimit('min', 'y')) / props.unitsPerTickY
        )
      );
      setWidth(
        getLimit('max', 'x') - getLimit('min', 'x') < window.innerWidth
          ? window.innerWidth
          : getLimit('max', 'x') - getLimit('min', 'x')
      );
      if (chartRef.current) {
        setHeight(chartRef.current.height);
      }
      const context = ctx as CanvasRenderingContext2D;
      context.setTransform(1, 0, 0, -1, 0, 285);
      context.save();
      context.translate(offsetX, 0);
      context.clearRect(
        -offsetX,
        -0,
        window.innerWidth,
        rangeY > height ? rangeY : 285
      );
      context.strokeStyle = '#C7CCD9';
      context.lineWidth = 1;
      context.globalAlpha = 0.05;
      // draw tick marks
      for (let n = 0; n < numXTicks; n++) {
        context.beginPath();
        context.moveTo(
          ((n + 1) * width) / numXTicks,
          rangeY + 20 > height ? rangeY + 20 : height
        );
        context.lineTo(((n + 1) * width) / numXTicks, 0);
        context.stroke();
      }
      for (let n = 0; n < numYTicks; n++) {
        context.beginPath();
        context.moveTo(
          0,
          (n * (rangeY + 20 > height ? rangeY + 20 : height)) / numYTicks
        );
        context.lineTo(
          width,
          (n * (rangeY + 20 > height ? rangeY + 20 : height)) / numYTicks
        );
        context.stroke();
      }
      // draw line chart
      if (props.data) {
        context.beginPath();
        context.strokeStyle = '#00A3FF';
        context.lineWidth = 2;
        context.globalAlpha = 1;
        context.moveTo(
          0,
          (props.data[0].y - getLimit('min', 'y')) *
            (rangeY + 20 > height ? height / (rangeY + 20) : 1)
        );
        for (let n = 1; n < props.data.length; n++) {
          context.lineTo(
            props.data[n].x - props.data[0].x,
            (props.data[n].y - getLimit('min', 'y')) *
              (rangeY + 20 > height ? height / (rangeY + 20) : 1)
          );
        }
        context.stroke();
        for (let n = 0; n < props.data.length; n++) {
          if (n === hoverEl) {
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#346D8D';
            context.moveTo(
              0,
              (props.data[n].y - getLimit('min', 'y')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1)
            );
            context.lineTo(
              width,
              (props.data[n].y - getLimit('min', 'y')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1)
            );
            context.stroke();
            context.moveTo(props.data[n].x - props.data[0].x, 0);
            context.lineTo(
              props.data[n].x - props.data[0].x,
              rangeY + 20 > height ? rangeY + 20 : height
            );
            context.stroke();
            context.beginPath();
            context.lineWidth = 7;
            context.strokeStyle = '#84D3FF';
            context.globalAlpha = 0.33;
            context.arc(
              props.data[n].x - props.data[0].x,
              (props.data[n].y - getLimit('min', 'y')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1),
              5,
              0,
              2 * Math.PI,
              false
            );
            context.stroke();
            context.beginPath();
            context.lineWidth = 2;
            context.fillStyle = '#FFFFFF';
            context.strokeStyle = '#84D3FF';
            context.globalAlpha = 1;
            context.arc(
              props.data[n].x - props.data[0].x,
              (props.data[n].y - getLimit('min', 'y')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1),
              3,
              0,
              2 * Math.PI,
              false
            );
            context.fill();
            context.stroke();
          }
        }
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
      chartRef.current?.addEventListener('mouseleave', () => {
        drag = false;
        hoverEl = -1;
      });
      chartRef.current?.addEventListener('mousemove', (e: MouseEvent) => {
        if (drag) {
          offsetX = offsetX + e.movementX;
          if (offsetX > 0) offsetX = 0;
          if (offsetX < canvasWidth - width) offsetX = canvasWidth - width;
        }
        if (props.data) {
          for (let n = 0; n < props.data.length; n++) {
            if (
              props.data[n].x - props.data[0].x - 6 < e.clientX - offsetX &&
              props.data[n].x - props.data[0].x + 6 > e.clientX - offsetX &&
              (props.data[n].y - getLimit('min', 'y')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1) -
                6 <
                345 - e.clientY &&
              (props.data[n].y - getLimit('min', 'y')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1) +
                6 >
                345 - e.clientY
            ) {
              hoverEl = n;
              break;
            } else {
              hoverEl = -1;
            }
          }
        }
        window.requestAnimationFrame(draw);
      });
    }
  }, [ctx, props, height, width, numXTicks, numYTicks, canvasWidth, rangeY]);

  return (
    <canvas className="Chart" ref={chartRef} width={canvasWidth} height={285}>
      Canvas not supported.
    </canvas>
  );
}

export default Chart;
