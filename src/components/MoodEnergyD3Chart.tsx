import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { DailyMoodEnergyLog } from '../types';
import {
  TrendingUp,
  Activity,
  Sparkles,
  Heart,
  Zap,
  Calendar,
  Filter,
  CheckCircle2,
  Info,
  ChevronRight,
  Plus,
  RotateCcw
} from 'lucide-react';

interface MoodEnergyD3ChartProps {
  initialData: DailyMoodEnergyLog[];
  onAddNotification?: (notif: {
    title: string;
    message: string;
    type: 'cycle' | 'hydration' | 'community' | 'course' | 'mentor';
    targetTab?: 'home' | 'community' | 'learn' | 'mentors' | 'wellness' | 'ai' | 'profile';
  }) => void;
}

export const MoodEnergyD3Chart: React.FC<MoodEnergyD3ChartProps> = ({
  initialData,
  onAddNotification
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // State
  const [data, setData] = useState<DailyMoodEnergyLog[]>(() => {
    const saved = localStorage.getItem('her_aura_mood_energy_30d');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialData;
  });

  const [activeSeries, setActiveSeries] = useState<'both' | 'mood' | 'energy'>('both');
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');
  const [hoveredPoint, setHoveredPoint] = useState<DailyMoodEnergyLog | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Quick Log Today Form state
  const [todayMood, setTodayMood] = useState<number>(8.0);
  const [todayEnergy, setTodayEnergy] = useState<number>(7.5);
  const [todayPhase, setTodayPhase] = useState<'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal'>('Follicular');
  const [todayNotes, setTodayNotes] = useState<string>('');
  const [logNotice, setLogNotice] = useState<string | null>(null);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('her_aura_mood_energy_30d', JSON.stringify(data));
  }, [data]);

  // Filtered data based on time range
  const filteredData = useMemo(() => {
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (timeRange === '7d') return sorted.slice(-7);
    if (timeRange === '14d') return sorted.slice(-14);
    return sorted.slice(-30);
  }, [data, timeRange]);

  // Summary Metrics
  const metrics = useMemo(() => {
    if (filteredData.length === 0) {
      return { avgMood: 0, avgEnergy: 0, peakMoodDay: null, peakEnergyDay: null };
    }
    const sumMood = filteredData.reduce((acc, curr) => acc + curr.moodScore, 0);
    const sumEnergy = filteredData.reduce((acc, curr) => acc + curr.energyScore, 0);
    const avgMood = (sumMood / filteredData.length).toFixed(1);
    const avgEnergy = (sumEnergy / filteredData.length).toFixed(1);

    const peakMoodDay = [...filteredData].sort((a, b) => b.moodScore - a.moodScore)[0];
    const peakEnergyDay = [...filteredData].sort((a, b) => b.energyScore - a.energyScore)[0];

    return { avgMood, avgEnergy, peakMoodDay, peakEnergyDay };
  }, [filteredData]);

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawing

    // Get responsive container dimensions
    const containerWidth = containerRef.current.clientWidth || 700;
    const height = Math.min(380, Math.max(280, containerWidth * 0.45));
    const margin = { top: 28, right: 30, bottom: 42, left: 44 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', containerWidth)
      .attr('height', height)
      .attr('viewBox', `0 0 ${containerWidth} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parsedData = filteredData.map((d) => ({
      ...d,
      parsedDate: new Date(d.date + 'T12:00:00')
    }));

    // Scales
    const xExtent = d3.extent(parsedData, (d) => d.parsedDate) as [Date, Date];
    const xScale = d3.scaleTime().domain(xExtent).range([0, innerWidth]);

    const yScale = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);

    // Gradients for Area Fills
    const defs = svg.append('defs');

    // Mood Gradient (Vibrant Magenta Pink to Transparent)
    const moodGradient = defs
      .append('linearGradient')
      .attr('id', 'mood-gradient-fill')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    moodGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#e6007e')
      .attr('stop-opacity', 0.32);

    moodGradient
      .append('stop')
      .attr('offset', '80%')
      .attr('stop-color', '#e6007e')
      .attr('stop-opacity', 0.04);

    moodGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#e6007e')
      .attr('stop-opacity', 0.0);

    // Energy Gradient (Warm Amber / Coral to Transparent)
    const energyGradient = defs
      .append('linearGradient')
      .attr('id', 'energy-gradient-fill')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    energyGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f59e0b')
      .attr('stop-opacity', 0.28);

    energyGradient
      .append('stop')
      .attr('offset', '80%')
      .attr('stop-color', '#f59e0b')
      .attr('stop-opacity', 0.04);

    energyGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f59e0b')
      .attr('stop-opacity', 0.0);

    // Subtle Grid lines (Y-axis)
    const yAxisGrid = d3
      .axisLeft(yScale)
      .tickValues([2, 4, 6, 8, 10])
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'y-grid')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', '#f3e8f0')
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-opacity', 0.9);

    g.select('.y-grid .domain').remove(); // remove axis line for grid

    // X Axis
    const tickCount = containerWidth < 480 ? 4 : timeRange === '7d' ? 7 : 8;
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(tickCount)
      .tickFormat(d3.timeFormat('%b %d') as any);

    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    xAxisG.select('.domain').attr('stroke', '#e2e8f0');
    xAxisG
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('dy', '1em');

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues([0, 2, 4, 6, 8, 10])
      .tickFormat((d) => `${d}`);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.select('.domain').remove();
    yAxisG
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('dx', '-0.3em');

    // D3 Line & Area Generators
    const moodArea = d3
      .area<any>()
      .x((d) => xScale(d.parsedDate))
      .y0(innerHeight)
      .y1((d) => yScale(d.moodScore))
      .curve(d3.curveMonotoneX);

    const moodLine = d3
      .line<any>()
      .x((d) => xScale(d.parsedDate))
      .y((d) => yScale(d.moodScore))
      .curve(d3.curveMonotoneX);

    const energyArea = d3
      .area<any>()
      .x((d) => xScale(d.parsedDate))
      .y0(innerHeight)
      .y1((d) => yScale(d.energyScore))
      .curve(d3.curveMonotoneX);

    const energyLine = d3
      .line<any>()
      .x((d) => xScale(d.parsedDate))
      .y((d) => yScale(d.energyScore))
      .curve(d3.curveMonotoneX);

    // Draw Energy Area & Line
    if (activeSeries === 'both' || activeSeries === 'energy') {
      g.append('path')
        .datum(parsedData)
        .attr('fill', 'url(#energy-gradient-fill)')
        .attr('d', energyArea);

      g.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', energyLine);
    }

    // Draw Mood Area & Line
    if (activeSeries === 'both' || activeSeries === 'mood') {
      g.append('path')
        .datum(parsedData)
        .attr('fill', 'url(#mood-gradient-fill)')
        .attr('d', moodArea);

      g.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', '#e6007e')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', moodLine);
    }

    // Data Points (Circles)
    if (activeSeries === 'both' || activeSeries === 'mood') {
      g.selectAll('.mood-dot')
        .data(parsedData)
        .enter()
        .append('circle')
        .attr('class', 'mood-dot')
        .attr('cx', (d) => xScale(d.parsedDate))
        .attr('cy', (d) => yScale(d.moodScore))
        .attr('r', parsedData.length > 14 ? 3.5 : 4.5)
        .attr('fill', '#ffffff')
        .attr('stroke', '#e6007e')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0px 1px 2px rgba(230, 0, 126, 0.25))');
    }

    if (activeSeries === 'both' || activeSeries === 'energy') {
      g.selectAll('.energy-dot')
        .data(parsedData)
        .enter()
        .append('circle')
        .attr('class', 'energy-dot')
        .attr('cx', (d) => xScale(d.parsedDate))
        .attr('cy', (d) => yScale(d.energyScore))
        .attr('r', parsedData.length > 14 ? 3 : 4)
        .attr('fill', '#ffffff')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2);
    }

    // Vertical Focus Crosshair Guideline
    const focusLine = g
      .append('line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('opacity', 0);

    // Focus circles
    const focusMoodCircle = g
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#e6007e')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    const focusEnergyCircle = g
      .append('circle')
      .attr('r', 5.5)
      .attr('fill', '#f59e0b')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    // Interactive Overlay for Mouse and Touch Tracking
    const bisectDate = d3.bisector((d: any) => d.parsedDate).left;

    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    const handlePointerMove = (event: any) => {
      const [pointerX] = d3.pointer(event, overlay.node());
      const x0 = xScale.invert(pointerX);
      const idx = bisectDate(parsedData, x0, 1);
      const d0 = parsedData[idx - 1];
      const d1 = parsedData[idx];

      let selected = d0;
      if (d0 && d1) {
        selected =
          x0.getTime() - d0.parsedDate.getTime() > d1.parsedDate.getTime() - x0.getTime()
            ? d1
            : d0;
      } else if (!d0 && d1) {
        selected = d1;
      }

      if (selected) {
        const xPos = xScale(selected.parsedDate);
        focusLine.attr('x1', xPos).attr('x2', xPos).style('opacity', 1);

        if (activeSeries === 'both' || activeSeries === 'mood') {
          focusMoodCircle
            .attr('cx', xPos)
            .attr('cy', yScale(selected.moodScore))
            .style('opacity', 1);
        } else {
          focusMoodCircle.style('opacity', 0);
        }

        if (activeSeries === 'both' || activeSeries === 'energy') {
          focusEnergyCircle
            .attr('cx', xPos)
            .attr('cy', yScale(selected.energyScore))
            .style('opacity', 1);
        } else {
          focusEnergyCircle.style('opacity', 0);
        }

        setHoveredPoint(selected);
        setTooltipPos({
          x: xPos + margin.left,
          y: Math.min(yScale(selected.moodScore), yScale(selected.energyScore)) + margin.top
        });
      }
    };

    const handlePointerLeave = () => {
      focusLine.style('opacity', 0);
      focusMoodCircle.style('opacity', 0);
      focusEnergyCircle.style('opacity', 0);
      setHoveredPoint(null);
      setTooltipPos(null);
    };

    overlay
      .on('mousemove', handlePointerMove)
      .on('mouseleave', handlePointerLeave)
      .on('touchmove', handlePointerMove)
      .on('touchend', handlePointerLeave);

  }, [filteredData, activeSeries, timeRange]);

  // Handle Log Today Submit
  const handleLogToday = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const newLog: DailyMoodEnergyLog = {
      id: 'me-' + Date.now(),
      date: todayStr,
      displayDate: todayFormatted,
      timestamp: Date.now(),
      moodScore: Number(todayMood.toFixed(1)),
      energyScore: Number(todayEnergy.toFixed(1)),
      cyclePhase: todayPhase,
      notes: todayNotes.trim() || 'Daily conscious wellness check-in',
      tag: `${todayPhase} Aura`
    };

    // Replace if today already exists, or append
    setData((prev) => {
      const existsIndex = prev.findIndex((p) => p.date === todayStr);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newLog;
        return updated;
      }
      return [...prev, newLog];
    });

    setLogNotice(`✨ Today's Mood (${todayMood}/10) & Energy (${todayEnergy}/10) updated in your 30-day telemetry!`);
    setTimeout(() => setLogNotice(null), 3500);

    if (onAddNotification) {
      onAddNotification({
        title: '📊 30-Day Wellness Telemetry Updated',
        message: `Logged Mood: ${todayMood}/10, Energy: ${todayEnergy}/10. Keep honoring your natural cycle.`,
        type: 'cycle',
        targetTab: 'wellness'
      });
    }
  };

  const handleResetSampleData = () => {
    setData(initialData);
    localStorage.removeItem('her_aura_mood_energy_30d');
    setLogNotice('Reset to 30-day baseline telemetry.');
    setTimeout(() => setLogNotice(null), 2500);
  };

  return (
    <div id="mood-energy-d3-tracker" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Mood & Energy Trends
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
                  D3.js Powered
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Visualizing daily emotional resilience and physical vitality over the past 30 days
              </p>
            </div>
          </div>

          {/* Time Range Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-pink-50/80 dark:bg-gray-800/80 rounded-xl border border-pink-100 dark:border-gray-700 text-xs self-start sm:self-auto">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-white dark:bg-gray-700 text-[#e6007e] dark:text-pink-400 shadow-2xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Summary Stat Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30">
            <div className="flex items-center justify-between text-xs text-pink-600 dark:text-pink-400 font-semibold mb-1">
              <span>Avg Mood</span>
              <Heart className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {metrics.avgMood} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/10</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Uplifted & Harmonious</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">
              <span>Avg Energy</span>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {metrics.avgEnergy} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/10</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Balanced Vitality</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
              <span>Peak Mood</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {metrics.peakMoodDay?.moodScore || 9.3} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/10</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {metrics.peakMoodDay?.displayDate || 'Mar 08'} • Ovulation
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
              <span>Streak</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {filteredData.length} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">days</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Continuous telemetry</p>
          </div>
        </div>

        {/* Series Legend & Interactive Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSeries('both')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSeries === 'both'
                  ? 'bg-gray-100 dark:bg-gray-800 font-bold text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>Show Both</span>
            </button>

            <button
              onClick={() => setActiveSeries('mood')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSeries === 'mood'
                  ? 'bg-pink-100 dark:bg-pink-950/70 text-[#e6007e] dark:text-pink-300 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#e6007e] inline-block shadow-2xs" />
              <span>Mood (Pink)</span>
            </button>

            <button
              onClick={() => setActiveSeries('energy')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSeries === 'energy'
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block shadow-2xs" />
              <span>Energy (Amber)</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-pink-400" />
            <span>Hover or drag cursor across chart to inspect daily milestones</span>
          </div>
        </div>

        {/* D3 SVG Chart Container */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden bg-gradient-to-b from-pink-50/20 to-white dark:from-gray-800/40 dark:to-gray-900 rounded-2xl border border-pink-100/70 dark:border-gray-800 pt-2"
        >
          <svg ref={svgRef} className="w-full block" />

          {/* Interactive Tooltip Card floating over hovered coordinates */}
          {hoveredPoint && tooltipPos && (
            <div
              className="pointer-events-none absolute z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-pink-200 dark:border-gray-700 text-xs min-w-[190px] transition-all duration-75"
              style={{
                left: Math.min(Math.max(10, tooltipPos.x - 95), (containerRef.current?.clientWidth || 300) - 200),
                top: Math.max(10, tooltipPos.y - 100)
              }}
            >
              <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-1 mb-1.5">
                <span>{hoveredPoint.displayDate}</span>
                {hoveredPoint.cyclePhase && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300">
                    {hoveredPoint.cyclePhase} Phase
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#e6007e] dark:text-pink-400 font-semibold">
                    <Heart className="w-3 h-3" /> Mood:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{hoveredPoint.moodScore} / 10</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <Zap className="w-3 h-3" /> Energy:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{hoveredPoint.energyScore} / 10</span>
                </div>

                {hoveredPoint.notes && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 italic pt-1 border-t border-gray-100 dark:border-gray-800 mt-1 line-clamp-2">
                    "{hoveredPoint.notes}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Biological Cycle Correlation Insight */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/80 to-purple-50/80 dark:from-pink-950/30 dark:to-purple-950/30 border border-pink-100 dark:border-pink-900/30 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white">Cyclical Harmony Insight: </span>
            Your highest energy and mood resilience cluster around <strong>Ovulation (Days 13-16)</strong>, followed by steady restorative focus in the <strong>Luteal Phase</strong>. Rest days during <strong>Menstrual Day 1-3</strong> demonstrate healthy physical rejuvenation.
          </div>
        </div>
      </div>

      {/* Quick Check-in Logger: Log Today's Mood & Energy */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-[#e6007e] dark:text-pink-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Log Today’s Check-In
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Record your present mood and energy to enrich your continuous 30-day D3.js line chart
              </p>
            </div>
          </div>

          <button
            onClick={handleResetSampleData}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset to 30-day baseline data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>
        </div>

        {logNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{logNotice}</span>
          </div>
        )}

        <form onSubmit={handleLogToday} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mood Slider */}
            <div className="p-4 rounded-2xl bg-pink-50/40 dark:bg-gray-800/60 border border-pink-100 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#e6007e] dark:text-pink-400" />
                  <span>Today's Mood Score</span>
                </label>
                <span className="px-2 py-0.5 rounded-full bg-[#e6007e] text-white text-xs font-bold">
                  {todayMood.toFixed(1)} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={todayMood}
                onChange={(e) => setTodayMood(parseFloat(e.target.value))}
                className="w-full accent-[#e6007e] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                <span>1 (Vulnerable)</span>
                <span>5 (Calm / Neutral)</span>
                <span>10 (Radiant Joy)</span>
              </div>
            </div>

            {/* Energy Slider */}
            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-gray-800/60 border border-amber-100 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Today's Energy Level</span>
                </label>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                  {todayEnergy.toFixed(1)} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={todayEnergy}
                onChange={(e) => setTodayEnergy(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                <span>1 (Exhausted / Rest)</span>
                <span>5 (Steady)</span>
                <span>10 (Peak Vitality)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cycle Phase */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Current Hormonal Phase:
              </label>
              <select
                value={todayPhase}
                onChange={(e) => setTodayPhase(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Menstrual">🌸 Menstrual Phase (Rest & Rejuvenation)</option>
                <option value="Follicular">🌱 Follicular Phase (Rising Energy & Focus)</option>
                <option value="Ovulation">✨ Ovulation Phase (Peak Confidence & Connection)</option>
                <option value="Luteal">🍂 Luteal Phase (Mindful Pacing & Self-Care)</option>
              </select>
            </div>

            {/* Reflection Note */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Daily Reflection or Self-Care Note:
              </label>
              <input
                type="text"
                value={todayNotes}
                onChange={(e) => setTodayNotes(e.target.value)}
                placeholder="e.g. Afternoon chamomile tea, walk with mentor, coding sprint"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Today's 30-Day Telemetry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
