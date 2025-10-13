import { Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { useState, useEffect } from "react";
import { Circle } from "@mui/icons-material";

const Chords = () => {
    const keys = [
        "C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"
    ];

    // In a major key the basic diatonic chord qualities (1..7)
    const degreeQualities = ["maj", "min", "min", "maj", "dom", "min", "dim"];

    const [tempo, setTempo] = useState<number>(120);
    const [beat, setBeat] = useState<number>(0);
    const [keySignature, setKeySignature] = useState<string>("C");
    const [includeMajor, setIncludeMajor] = useState<boolean>(true);
    const [includeMinor, setIncludeMinor] = useState<boolean>(true);
    const [includeDominant, setIncludeDominant] = useState<boolean>(true);
    const [playing, setPlaying] = useState<boolean>(false);
    const [currentChord, setCurrentChord] = useState<{ degree: number; quality: string } | null>(null);

    // Build the selectable pool of Nashville numbers based on the chosen key and enabled qualities
    const buildPool = () => {
        const pool: { degree: number; quality: string }[] = [];
        for (let i = 0; i < 7; i++) {
            const q = degreeQualities[i];
            if (q === "maj" && includeMajor) pool.push({ degree: i + 1, quality: "maj" });
            if (q === "min" && includeMinor) pool.push({ degree: i + 1, quality: "min" });
            if (q === "dom" && includeDominant) pool.push({ degree: i + 1, quality: "dom" });
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
        if (picked) setCurrentChord(picked);
    };

    // When tempo or playing changes, (re)start timer
    useEffect(() => {
        if (!playing) return;
        const intervalMs = Math.max(50, Math.round(60000 / Math.max(1, tempo))); // guard lower bound
        const id = window.setInterval(() => {
            nextChord()
            setBeat(-1)
        }, intervalMs * 4);
        const id2 = window.setInterval(() => {
            setBeat((b) => (b + 1) % 4);
        }, intervalMs);
        return () => { window.clearInterval(id); window.clearInterval(id2); }
    }, [playing, tempo, includeMajor, includeMinor, includeDominant, keySignature]);

    // If pool empties while playing, stop playback
    useEffect(() => {
        if (playing && buildPool().length === 0) setPlaying(false);
    }, [includeMajor, includeMinor, includeDominant, playing]);

    // Initialize first chord on mount
    useEffect(() => {
        nextChord();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Render a full UI here and return early (this replaces the later return in file)
    return (
        <GlassSpace size="tiny" style={{ overflowY: "scroll", height: "83vh", padding: 16 }}>
            <Stack spacing={2} maxWidth={800}>
                <GlassText size="massive" component="h1" style={{ marginBottom: 8 }}>
                    Chords
                </GlassText>

                {/* Big Nashville number display */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 160,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 8
                }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>
                            {currentChord ? currentChord.degree : "-"}
                        </div>
                        <Stack direction='row'>
                            {beat >= 0 && <Circle />}
                            {beat >= 1 && <Circle />}
                            {beat >= 2 && <Circle />}
                            {beat >= 3 && <Circle />}
                        </Stack>
                        <div style={{ fontSize: 18, opacity: 0.85 }}>
                            {currentChord ? `${currentChord.quality.toUpperCase()} — Key: ${keySignature}` : "No chord"}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ minWidth: 240 }}>
                        <label style={{ display: "block", marginBottom: 8 }}>Tempo (BPM): {tempo}</label>
                        <input
                            type="range"
                            min={30}
                            max={240}
                            value={tempo}
                            onChange={(e) => setTempo(parseInt(e.target.value, 10))}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 8 }}>Key signature</label>
                        <select
                            value={keySignature}
                            onChange={(e) => setKeySignature(e.target.value)}
                            style={{ padding: "8px 10px", borderRadius: 6 }}
                        >
                            {keys.map((k) => (
                                <option key={k} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ paddingTop: 8 }}>
                        <div style={{ marginBottom: 6 }}>Include chord qualities</div>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="checkbox"
                                checked={includeMajor}
                                onChange={(e) => setIncludeMajor(e.target.checked)}
                            />
                            Major
                        </label>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="checkbox"
                                checked={includeMinor}
                                onChange={(e) => setIncludeMinor(e.target.checked)}
                            />
                            Minor
                        </label>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="checkbox"
                                checked={includeDominant}
                                onChange={(e) => setIncludeDominant(e.target.checked)}
                            />
                            Dominant
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={() => setPlaying((p) => !p)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 6,
                            background: playing ? "#ef5350" : "#1976d2",
                            color: "white",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {playing ? "Stop" : "Play"}
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
                            setIncludeMajor(true);
                            setIncludeMinor(true);
                            setIncludeDominant(true);
                            setKeySignature("C");
                            setTempo(120);
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
        </GlassSpace>
    );
    return <GlassSpace size="tiny" style={{ overflowY: 'scroll', height: '83vh' }}>
        <Stack spacing={1} maxWidth={800}>
            <GlassText variant="h4" component="h1" style={{ marginBottom: 16 }}>Chords</GlassText>
        </Stack>
    </GlassSpace>
}

export default Chords
