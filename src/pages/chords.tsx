import { Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { useState, useEffect } from "react";
import { Circle } from "@mui/icons-material";

type State = {
    tempo: number;
    beat: number;
    keySignature: string;
    includeMajor: boolean;
    includeMinor: boolean;
    includeDominant: boolean;
    playing: boolean;
    currentChord: { degree: number; quality: string } | null;
    nextChord: { degree: number; quality: string } | null;
}

const Chords = () => {
    const [state, setState] = useState<State>({
        tempo: 120,
        beat: -1,
        keySignature: "C",
        includeMajor: true,
        includeMinor: false,
        includeDominant: false,
        playing: true,
        currentChord: null,
        nextChord: null,
    });

    // Build the selectable pool of Nashville numbers based on the chosen key and enabled qualities
    const buildPool = () => {
        const pool: { degree: number; quality: string }[] = [];
        for (let i = 0; i < 7; i++) {
            if (state.includeMajor) pool.push({ degree: i + 1, quality: "maj" });
            if (state.includeMinor) pool.push({ degree: i + 1, quality: "min" });
            if (state.includeDominant) pool.push({ degree: i + 1, quality: "dom" });
            // intentionally skip diminished (dim) unless you want to include it separately later
        }
        return pool;
    };

    const pickRandomChord = () => {
        const pool = buildPool();
        if (pool.length === 0) return null;
        const idx = Math.floor(Math.random() * pool.length);
        return pool[idx];
    };

    // Advance to next chord (manual or timer-driven)
    const nextChord = () => {
        const picked = pickRandomChord();
        if (picked) setState(old => ({ ...old, currentChord: old.nextChord, nextChord: picked }));
    };

    // When tempo or playing changes, (re)start timer
    useEffect(() => {
        if (!state.playing) return;
        setState(old => ({ ...old, beat: 0 }))

        const intervalMs = Math.max(50, Math.round(60000 / Math.max(1, state.tempo))); // guard lower bound
        const id = window.setInterval(() => {
            nextChord()
            setState(old => ({ ...old, beat: -1 }))
        }, intervalMs * 4);
        const id2 = window.setInterval(() => {
            setState(old => ({ ...old, beat: (old.beat + 1) % 4 }))
        }, intervalMs);
        return () => { window.clearInterval(id); window.clearInterval(id2); }
    }, [state.tempo, state.playing, state.includeMajor, state.includeMinor, state.includeDominant]);

    // If pool empties while playing, stop playback
    useEffect(() => {
        if (state.playing && buildPool().length === 0) setState(old => ({ ...old, playing: false }))
    }, [state.includeMajor, state.includeMinor, state.includeDominant, state.playing]);

    // Initialize first chord on mount
    useEffect(() => {
        nextChord();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Render a full UI here and return early (this replaces the later return in file)
    return <Stack spacing={2} maxWidth="100%" display='flex' justifyContent='center' alignItems='center' margin='auto'>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: '100vh', justifyContent: 'center' }}>
            <div style={{ display: "flex", alignItems: "end", lineHeight: 1 }}>
                <div style={{ fontSize: 400, lineHeight: -100 }}>{state.currentChord ? state.currentChord.degree : "-"}</div>
                <div style={{ fontSize: 50, lineHeight: 3 }}>{state.currentChord?.quality.toUpperCase()}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <GlassText size="large">{state.nextChord ? state.nextChord.degree : "-"}</GlassText>
                <GlassText size="moderate">{state.nextChord?.quality.toUpperCase()}</GlassText>
            </div>
            <Stack direction='row'>
                {state.beat >= 0 && <Circle />}
                {state.beat >= 1 && <Circle />}
                {state.beat >= 2 && <Circle />}
                {state.beat >= 3 && <Circle />}
            </Stack>
        </div>

        {/* Controls */}
        <div style={{ minWidth: 240 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Tempo (BPM): {state.tempo}</label>
            <input
                type="range"
                min={30}
                max={240}
                value={state.tempo}
                onChange={(e) => setState(old => ({ ...old, tempo: parseInt(e.target.value, 10) }))}
                style={{ width: "100%" }}
            />
        </div>

        <div style={{ paddingTop: 8 }}>
            <div style={{ marginBottom: 6 }}>Include chord qualities</div>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                    type="checkbox"
                    checked={state.includeMajor}
                    onChange={_ => setState(old => ({ ...old, includeMajor: !old.includeMajor }))}
                />
                Major
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                    type="checkbox"
                    checked={state.includeMinor}
                    onChange={_ => setState(old => ({ ...old, includeMinor: !old.includeMinor }))}
                />
                Minor
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                    type="checkbox"
                    checked={state.includeDominant}
                    onChange={_ => setState(old => ({ ...old, includeDominant: !old.includeDominant }))}
                />
                Dominant
            </label>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
            <button
                onClick={() => setState(old => ({ ...old, playing: !old.playing }))}
                style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: state.playing ? "#ef5350" : "#1976d2",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                {state.playing ? "Stop" : "Play"}
            </button>

            <button
                onClick={nextChord}
                style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                Next
            </button>

            <button
                onClick={() => {
                    setState(old => ({
                        ...old,
                        includeMajor: true,
                        includeMinor: true,
                        includeDominant: true,
                        keySignature: "C",
                    }));
                    nextChord();
                }}
                style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#9e9e9e",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                Reset
            </button>
        </div>

        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            Tip: Use the checkboxes to include/exclude major, minor and dominant chords. The slider sets the BPM (higher = faster changes).
        </div>
    </Stack>
}

export default Chords
