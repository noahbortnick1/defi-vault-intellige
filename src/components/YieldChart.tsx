import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface YieldChartProps {
  data: { timestamp: number; apy: number; tvl: number }[];
  width?: number;
  height?: number;
}

export function YieldChart({ data, width = 600, height = 300 }: YieldChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.timestamp) as [number, number])
      .range([0, chartWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.apy) as number])
      .nice()
      .range([chartHeight, 0]);

    const line = d3
      .line<{ timestamp: number; apy: number }>()
      .x((d) => x(d.timestamp))
      .y((d) => y(d.apy))
      .curve(d3.curveMonotoneX);

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('color', 'oklch(0.55 0.01 240)');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%`))
      .attr('color', 'oklch(0.55 0.01 240)');

    const path = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.75 0.15 195)')
      .attr('stroke-width', 2)
      .attr('d', line);

    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} className="overflow-visible" />;
}
