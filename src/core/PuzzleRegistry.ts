import { ComponentType } from 'react';
import { SignalGridTerminal } from '../modules/SignalGrid/Terminal';
import { SignalGridManual } from '../modules/SignalGrid/Manual';
import { WireCutterTerminal } from '../modules/WireCutter/Terminal';
import { WireCutterManual } from '../modules/WireCutter/Manual';
import { WaveformTerminal } from '../modules/Waveform/Terminal';
import { WaveformManual } from '../modules/Waveform/Manual';
import { BigButtonTerminal } from '../modules/BigButton/Terminal';
import { BigButtonManual } from '../modules/BigButton/Manual';

export interface PuzzleModule {
  id: string;
  name: string;
  TerminalUI: ComponentType<any>;
  ManualUI: ComponentType<any>;
}

export const PuzzleRegistry: PuzzleModule[] = [
  {
    id: 'big-button',
    name: '巨型按钮 (The Big Button)',
    TerminalUI: BigButtonTerminal,
    ManualUI: BigButtonManual,
  },
  {
    id: 'waveform',
    name: 'Waveform Calibration',
    TerminalUI: WaveformTerminal,
    ManualUI: WaveformManual,
  },
  {
    id: 'wire-cutter',
    name: 'High-Voltage Wire Cutter',
    TerminalUI: WireCutterTerminal,
    ManualUI: WireCutterManual,
  },
  {
    id: 'signal-grid',
    name: 'Signal Grid Prototype',
    TerminalUI: SignalGridTerminal,
    ManualUI: SignalGridManual,
  }
];
