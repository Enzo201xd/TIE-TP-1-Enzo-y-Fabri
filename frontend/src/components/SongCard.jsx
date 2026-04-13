import React from 'react';

const REGION_FLAGS = {
  'AR': '🇦🇷',
  'US': '🇺🇸',
  'ZZ': '🌍',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'GB': '🇬🇧',
  'JP': '🇯🇵',
  'KR': '🇰🇷',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
};

const SongCard = ({ song, selected, onClick, compact, delay }) => {
  const style = delay ? { animationDelay: `${delay}ms` } : {};

  // Compact variant: used inside map popups (vertical layout)
  if (compact) {
    return (
      <div className="song-card compact">
        {song.song.thumbnail ? (
          <img
            src={song.song.thumbnail}
            alt={song.song.title}
            className="song-card-thumb"
            loading="lazy"
          />
        ) : (
          <div className="song-card-no-thumb">🎵</div>
        )}
        <div className="song-card-info">
          <div className="song-card-region">
            {REGION_FLAGS[song.id] || '📍'} {song.region} #1
          </div>
          <div className="song-card-title">{song.song.title}</div>
          <div className="song-card-artist">{song.song.artist}</div>
          {song.song.videoId && (
            <a
              href={`https://music.youtube.com/watch?v=${song.song.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-music-link"
              id={`yt-link-${song.id}`}
            >
              ▶ Listen on YT Music
            </a>
          )}
        </div>
      </div>
    );
  }

  // Default variant: used in sidebar (horizontal layout)
  return (
    <div
      className={`song-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      style={style}
      role="button"
      tabIndex={0}
      id={`song-card-${song.id}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {song.song.thumbnail ? (
        <img
          src={song.song.thumbnail}
          alt={song.song.title}
          className="song-card-thumb"
          loading="lazy"
        />
      ) : (
        <div className="song-card-no-thumb">🎵</div>
      )}
      <div className="song-card-info">
        <div className="song-card-title">{song.song.title}</div>
        <div className="song-card-artist">{song.song.artist}</div>
        <div className="song-card-region">
          {REGION_FLAGS[song.id] || '📍'} {song.region}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
