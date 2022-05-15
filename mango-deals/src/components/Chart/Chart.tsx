import React, { useRef, useState, useEffect } from 'react';
import './Chart.css';

type ChartProps = {
  unitsPerTickX: number;
  unitsPerTickY: number;
  data?: {
    date: number;
    value: number;
  }[];
};

function Chart(props: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [rangeY, setRangeY] = useState<number>(0);
  const [data, setData] = useState<
    {
      date: number;
      value: number;
    }[]
  >([]);
  const [numXTicks, setNumXTicks] = useState<number>(0);
  const [numYTicks, setNumYTicks] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(
    document.body.clientWidth
  );
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (props.data) {
      const arr = props.data
        .map((item) => {
          return {
            date: item.date / 1000,
            value: item.value,
          };
        })
        .reverse();
      setData(arr);
    }
  }, [props.data]);
  useEffect(() => {
    let first = true;
    let drag = false;
    let touchStart = 0;
    let offsetX = 0;
    let hoverEl = -1;
    const getLimit = (limit: 'min' | 'max', axis: 'date' | 'value') => {
      if (data) {
        const arr = [...data];
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
      if (
        first &&
        data.length &&
        getLimit('max', 'date') - getLimit('min', 'date') >
          document.body.clientWidth
      ) {
        offsetX =
          canvasWidth - (getLimit('max', 'date') - getLimit('min', 'date'));
      }
      setRangeY(getLimit('max', 'value') - getLimit('min', 'value'));
      setNumXTicks(
        Math.round(
          (getLimit('max', 'date') - getLimit('min', 'date') <
          document.body.clientWidth
            ? document.body.clientWidth
            : getLimit('max', 'date') - getLimit('min', 'date')) /
            props.unitsPerTickX
        )
      );
      setNumYTicks(
        Math.round(
          (getLimit('max', 'value') - getLimit('min', 'value') < 285
            ? 285
            : getLimit('max', 'value') - getLimit('min', 'value')) /
            props.unitsPerTickY
        )
      );
      setWidth(
        getLimit('max', 'date') - getLimit('min', 'date') <
          document.body.clientWidth
          ? document.body.clientWidth
          : getLimit('max', 'date') - getLimit('min', 'date')
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
        document.body.clientWidth,
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
      if (data) {
        context.beginPath();
        context.strokeStyle = '#00A3FF';
        context.lineWidth = 2;
        context.globalAlpha = 1;
        context.moveTo(
          0,
          (data[0].value - getLimit('min', 'value')) *
            (rangeY + 20 > height ? height / (rangeY + 20) : 1)
        );
        for (let n = 1; n < data.length; n++) {
          context.lineTo(
            data[n].date - data[0].date,
            (data[n].value - getLimit('min', 'value')) *
              (rangeY + 20 > height ? height / (rangeY + 20) : 1)
          );
        }
        context.stroke();
        for (let n = 0; n < data.length; n++) {
          if (n === hoverEl) {
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#346D8D';
            context.moveTo(
              0,
              (data[n].value - getLimit('min', 'value')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1)
            );
            context.lineTo(
              width,
              (data[n].value - getLimit('min', 'value')) *
                (rangeY + 20 > height ? height / (rangeY + 20) : 1)
            );
            context.stroke();
            context.moveTo(data[n].date - data[0].date, 0);
            context.lineTo(
              data[n].date - data[0].date,
              rangeY + 20 > height ? rangeY + 20 : height
            );
            context.stroke();
            context.beginPath();
            context.lineWidth = 7;
            context.strokeStyle = '#84D3FF';
            context.globalAlpha = 0.33;
            context.arc(
              data[n].date - data[0].date,
              (data[n].value - getLimit('min', 'value')) *
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
              data[n].date - data[0].date,
              (data[n].value - getLimit('min', 'value')) *
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
      first = false;
    };
    if (ctx) {
      window.requestAnimationFrame(draw);
      window.addEventListener('resize', () => {
        setCanvasWidth(document.body.clientWidth);
        window.requestAnimationFrame(draw);
      });
      chartRef.current?.addEventListener('mousedown', () => (drag = true));
      chartRef.current?.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].pageX;
        drag = true;
      });
      chartRef.current?.addEventListener('mouseup', () => (drag = false));
      chartRef.current?.addEventListener('mouseup', () => (drag = false));
      chartRef.current?.addEventListener('mouseleave', () => {
        drag = false;
        hoverEl = -1;
      });
      const dragMove = (e: any) => {
        if (e.type === 'touchmove') {
          e.movementX = e.touches[0].pageX - touchStart;
          e.pageX = e.touches[0].pageX;
          touchStart = e.touches[0].pageX;
        }
        if (drag) {
          offsetX = offsetX + e.movementX;
          if (offsetX > 0) offsetX = 0;
          if (offsetX < canvasWidth - width) offsetX = canvasWidth - width;
        }
        if (data) {
          for (let n = 0; n < data.length; n++) {
            if (
              data[n].date - data[0].date - 6 < e.pageX - offsetX &&
              data[n].date - data[0].date + 6 > e.pageX - offsetX
            ) {
              hoverEl = n;
              break;
            } else {
              hoverEl = -1;
            }
          }
        }
        window.requestAnimationFrame(draw);
      };
      chartRef.current?.addEventListener('mousemove', dragMove);
      chartRef.current?.addEventListener('touchmove', dragMove);
      return () => {
        chartRef.current?.removeEventListener('mousedown', () => (drag = true));
        chartRef.current?.removeEventListener('touchstart', (e) => {
          touchStart = e.touches[0].pageX;
          drag = true;
        });
        chartRef.current?.removeEventListener('mouseup', () => (drag = false));
        chartRef.current?.removeEventListener('mouseup', () => (drag = false));
        chartRef.current?.removeEventListener('mouseleave', () => {
          drag = false;
          hoverEl = -1;
        });
        chartRef.current?.removeEventListener('mousemove', dragMove);
        chartRef.current?.removeEventListener('touchmove', dragMove);
      };
    }
  }, [width, numXTicks, data, window.innerWidth]);

  return (
    <canvas className="Chart" ref={chartRef} width={canvasWidth} height={285}>
      Canvas not supported.
    </canvas>
  );
}

export default Chart;
