"use client";

import { AudioFeatures, SpotifyTrack } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { Music, Clock, Activity, Grid3x3 } from "lucide-react";

type TechnicalInfoProps = {
  track: SpotifyTrack;
  audioFeatures: AudioFeatures;
};

const PITCH_CLASS = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];

function getKeyAndMode(key: number, mode: number): string {
  if (key === -1) return "Unknown";
  const pitchClass = PITCH_CLASS[key];
  const modeName = mode === 1 ? "Major" : "Minor";
  return `${pitchClass} ${modeName}`;
}

export function TechnicalInfo({ track, audioFeatures }: TechnicalInfoProps) {
  const keyAndMode = getKeyAndMode(audioFeatures.key, audioFeatures.mode);
  const tempo = Math.round(audioFeatures.tempo);
  const timeSignature = audioFeatures.time_signature;
  const duration = formatDuration(track.duration_ms);

  const infoItems = [
    { icon: Music, label: "Key & Mode", value: keyAndMode, description: "Musical key and scale mode", },
    { icon: Activity, label: "Tempo", value: `${tempo} BPM`, description: "Beats per minute", },
    { icon: Grid3x3, label: "Time Signature", value: `${timeSignature}/4`, description: "Estimated time signature", },
    { icon: Clock, label: "Duration", value: duration, description: "Track length", },
  ];

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-4">Technical Info</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {infoItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Loudness:</span>
          <span className="font-medium">{audioFeatures.loudness.toFixed(2)} dB</span>
        </div>
      </div>
    </div>
  );
}

