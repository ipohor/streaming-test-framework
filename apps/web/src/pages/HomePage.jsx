import { useEffect, useMemo, useRef, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const mode = import.meta.env.VITE_MODE || "mock";
const isMockMode = mode === "mock";

const HomePage = () => {
  const audioRef = useRef(null);
  const mockPlaybackIntervalRef = useRef(null);
  const [catalog, setCatalog] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("Paused");
  const [playbackReady, setPlaybackReady] = useState(false);
  const [mockPlaybackActive, setMockPlaybackActive] = useState(false);

  const activeTrack = useMemo(() => catalog[activeIndex], [catalog, activeIndex]);

  useEffect(() => {
    const loadCatalog = async () => {
      const response = await fetch(`${apiBaseUrl}/catalog`);
      const data = await response.json();
      setCatalog(data.items || []);
      setActiveIndex(0);
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    return () => {
      if (mockPlaybackIntervalRef.current) {
        window.clearInterval(mockPlaybackIntervalRef.current);
      }
    };
  }, []);

  const postEvent = async (type, properties) => {
    await fetch(`${apiBaseUrl}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        ts: Date.now(),
        properties: properties || {}
      })
    });
  };

  const ensureAudio = () => {
    const audio = audioRef.current;
    if (!audio) return null;
    return audio;
  };

  const stopMockPlayback = () => {
    if (mockPlaybackIntervalRef.current) {
      window.clearInterval(mockPlaybackIntervalRef.current);
      mockPlaybackIntervalRef.current = null;
    }
  };

  const startMockPlayback = (audio) => {
    stopMockPlayback();
    setMockPlaybackActive(true);
    setPlaybackReady(true);
    mockPlaybackIntervalRef.current = window.setInterval(() => {
      audio.currentTime += 0.5;
    }, 500);
  };

  const startAudio = async (audio, url, delayMs = 0) => {
    if (audio.src !== url) {
      audio.src = url;
    }
    const delay = isMockMode ? delayMs : 0;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    setPlaybackReady(false);
    setMockPlaybackActive(false);
    stopMockPlayback();

    try {
      await audio.play();
      setPlaybackReady(true);
      return;
    } catch {
      try {
        audio.muted = true;
        await audio.play();
        setPlaybackReady(true);
        return;
      } catch {
        if (isMockMode) {
          startMockPlayback(audio);
          return;
        }
        throw new Error("Playback failed.");
      }
    }
  };

  const startPlaybackSession = async (trackId) => {
    const userId = localStorage.getItem("mockUserId") || "test_user";
    const response = await fetch(`${apiBaseUrl}/playback/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: "web-player",
        trackId,
        userId
      })
    });
    if (!response.ok) {
      throw new Error("Playback session failed.");
    }
    return response.json();
  };

  const handlePlay = async () => {
    const audio = ensureAudio();
    if (!audio) return;

    const session = await startPlaybackSession(activeTrack?.id);
    await startAudio(audio, session.streamUrl, session.slowStartMs || 0);
    setStatus("Playing");

    if (activeTrack) {
      await postEvent("PLAYBACK_START", { trackId: activeTrack.id, title: activeTrack.title });
    } else {
      await postEvent("PLAYBACK_START");
    }
  };

  const handlePause = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setStatus("Paused");
    setPlaybackReady(false);
    setMockPlaybackActive(false);
    stopMockPlayback();
  };

  const handleLike = async () => {
    if (activeTrack) {
      await postEvent("LIKE", { trackId: activeTrack.id, title: activeTrack.title });
    } else {
      await postEvent("LIKE");
    }
  };

  const handleSkip = async () => {
    const nextIndex = catalog.length ? (activeIndex + 1) % catalog.length : 0;
    setActiveIndex(nextIndex);
    const nextTrack = catalog[nextIndex];

    if (nextTrack) {
      await postEvent("SKIP", { trackId: nextTrack.id, title: nextTrack.title });
    } else {
      await postEvent("SKIP");
    }

    const audio = ensureAudio();
    if (audio) {
      const session = await startPlaybackSession(nextTrack?.id);
      await startAudio(audio, session.streamUrl, session.slowStartMs || 0);
      setStatus("Playing");
    }
  };

  return (
    <div className="page">
      <div className="layout">
        <section className="card">
          <h2>Catalog</h2>
          <div className="catalog">
            {catalog.map((item, index) => (
              <button
                key={item.id}
                className={index === activeIndex ? "catalog-item active" : "catalog-item"}
                onClick={() => setActiveIndex(index)}
              >
                <span>{item.title}</span>
                <span className="muted">{item.type}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card player">
          <h2>Player</h2>
          <div className="now-playing">
            <span className="label">Now Playing</span>
            <span data-testid="now-playing" className="title">
              {activeTrack ? activeTrack.title : "Select a track"}
            </span>
          </div>
          <div data-testid="playback-ready" className="status">
            Playback Ready: {playbackReady ? "ready" : "pending"}
          </div>
          <div className="controls">
            <button data-testid="play" className="primary" onClick={handlePlay}>
              Play
            </button>
            <button data-testid="pause" onClick={handlePause}>
              Pause
            </button>
            <button data-testid="like" onClick={handleLike}>
              Like
            </button>
            <button data-testid="skip" onClick={handleSkip}>
              Skip
            </button>
          </div>
          <div className="status">Status: {status}</div>
          <audio
            ref={audioRef}
            data-testid="audio"
            data-playback-ready={playbackReady}
            data-mock-playback={mockPlaybackActive}
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
