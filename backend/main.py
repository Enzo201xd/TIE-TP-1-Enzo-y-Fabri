from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ytmusicapi import YTMusic
import json

app = FastAPI()

# Allow frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In a real app, you would restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Start ytmusic client
yt = YTMusic()

# Coordinates for locations (Lat, Long)
REGIONS = {
    "AR": {"name": "Argentina", "lat": -38.4161, "lng": -63.6167},
    "US": {"name": "USA", "lat": 37.0902, "lng": -95.7129},
    "ZZ": {"name": "Global", "lat": 0.0, "lng": 0.0}
}

@app.get("/api/trending")
def get_trending_songs():
    results = []
    
    for code, info in REGIONS.items():
        try:
            # ytmusic API expects zz for global, us, ar, etc.
            country_code = 'ZZ' if code == 'ZZ' else code
            charts = yt.get_charts(country=country_code)
            
            # ytmusicapi get_charts returns lists of playlists for videos
            top_song = None
            
            # For Global (ZZ), the structure might have a 'songs' key with 'items'
            if "songs" in charts and "items" in charts["songs"] and len(charts["songs"]["items"]) > 0:
                top_song = charts["songs"]["items"][0]
            elif "videos" in charts and isinstance(charts["videos"], list) and len(charts["videos"]) > 0:
                # For countries, 'videos' is a list of playlists. 
                # Pick the first solid playlist (often 'Trending 20')
                playlist_id = charts["videos"][0].get("playlistId")
                if len(charts["videos"]) > 1 and "Trending" in charts["videos"][1].get("title", ""):
                    playlist_id = charts["videos"][1].get("playlistId")
                
                if playlist_id:
                    try:
                        playlist = yt.get_playlist(playlist_id)
                        if "tracks" in playlist and len(playlist["tracks"]) > 0:
                            top_song = playlist["tracks"][0]
                    except Exception:
                        pass
            
            # Fallback if no specific track could be fetched
            if not top_song and "videos" in charts and len(charts["videos"]) > 0:
                vid = charts["videos"][0]
                top_song = {
                    "title": vid.get("title", "Popular Music"),
                    "artists": [{"name": "Various Artists"}],
                    "thumbnails": vid.get("thumbnails", []),
                    "videoId": ""
                }
            elif not top_song and "artists" in charts and len(charts["artists"]) > 0:
                art = charts["artists"][0]
                top_song = {
                    "title": "Top Artist: " + art.get("title", "Unknown"),
                    "artists": [{"name": art.get("title", "")}],
                    "thumbnails": art.get("thumbnails", []),
                    "videoId": ""
                }
            
            if top_song:
                # Fallback to empty string if title/artists aren't formatted as expected
                title = top_song.get("title", 'Unknown Title')
                artists = ", ".join([a["name"] for a in top_song.get("artists", [])]) if "artists" in top_song else 'Unknown Artist'
                
                # Thumbnails
                thumbnail = ""
                if top_song.get("thumbnails"):
                    thumbnail = top_song["thumbnails"][-1].get("url", "")
                
                results.append({
                    "id": code,
                    "region": info["name"],
                    "lat": info["lat"],
                    "lng": info["lng"],
                    "song": {
                        "title": title,
                        "artist": artists,
                        "thumbnail": thumbnail,
                        "videoId": top_song.get("videoId", "")
                    }
                })
        except Exception as e:
            results.append({"error": str(e), "code": code})
            
    return results

@app.get("/")
def root():
    return {"message": "Welcome to the YT Music Map API! Hit /api/trending to get chart info."}
