const express = require("express");
const router = express.Router();
const Song = require("./model/Song");

// Get all songs
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one song
router.get("/songs/:id", getSong, (req, res) => {
  res.json(res.song);
});

// Create one song
router.post("/songs", async (req, res) => {
  const title = req.body.title;
  const album = req.body.album;
  const artist = req.body.artist;
  const genre = req.body.genre;

  if (title == null || title == "")
    return res.status(400).json({ message: "Title doesn't have to be null" });
  if (album == null || album == "")
    return res.status(400).json({ message: "Album doesn't have to be null" });
  if (artist == null || artist == "")
    return res.status(400).json({ message: "Artist doesn't have to be null" });
  if (genre == null || genre == "")
    return res.status(400).json({ message: "Genre doesn't have to be null" });

  const song = new Song({
    title,
    album,
    artist,
    genre,
  });

  try {
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one song using put method
router.put("/songs/:id", getSong, async (req, res) => {
  const title = req.body.title;
  const album = req.body.album;
  const artist = req.body.artist;
  const genre = req.body.genre;

  if (title == null || album == null || genre == null || artist == null)
    return res.status(400).json({ message: "Invalid request body" });

  //   res.song.title = req.body.title;

  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      {
        title,
        album,
        artist,
        genre,
      },
      { returnDocument: "after" }
    );
    res.json({ message: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one song
router.delete("/songs/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/songs/count/stat", async (req, res) => {
  try {
    const songs = await Song.find();

    const songsCount = songs.length;
    const albumsCount = new Set(songs.map((value) => value.album.toLowerCase()))
      .size;

    const artistsCount = new Set(
      songs.map((value) => value.artist.toLowerCase())
    ).size;
    const genresCount = new Set(songs.map((value) => value.genre.toLowerCase()))
      .size;

    const genres = songs.map((value) => value.genre.toLowerCase());

    const countGenres = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    const genreResult = Object.keys(countGenres).map((e) => ({
      title: e,
      number: countGenres[e],
    }));

    const albums = songs.map((value) => value.album.toLowerCase());

    const countAlbums = albums.reduce((acc, album) => {
      acc[album] = (acc[album] || 0) + 1;
      return acc;
    }, {});

    const albumResult = Object.keys(countAlbums).map((e) => ({
      title: e,
      number: countAlbums[e],
    }));

    return res.send([
      [
        { title: "Total Songs", number: songsCount },
        {
          title: "Total Albums",
          number: albumsCount,
        },
        {
          title: "Total Artists",
          number: artistsCount,
        },
        {
          title: "Total Genres",
          number: genresCount,
        },
      ],
      [...genreResult],
      [...albumResult],
    ]);
  } catch (error) {
    console.log(error);
  }

  return;
});

async function getSong(req, res, next) {
  try {
    let song = await Song.findById(req.params.id);
    if (song == null) {
      return res.status(404).json({ message: "Cannot find song" });
    }
    res.song = song;
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  next();
}

module.exports = router;
