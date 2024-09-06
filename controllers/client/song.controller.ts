import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/song-favourite.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
    console.log(req.params.slugTopic);

    const topic = await Topic.findOne({
        slug: req.params.slugTopic,
        deleted: false
    })

    // console.log(topic);

    const songs = await Song.find({
        topicId: topic.id,
        status: "active",
        deleted: false
    }).select("title avatar singerId like createdAt slug")


    for (const song of songs) {
        const infoSinger = await Singer.findOne({
            _id: song.singerId,
            deleted: false
        }).select("fullName");

        song["infoSinger"] = infoSinger;
    }

    // console.log(songs);

    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });

}

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  const slugSong: String  = req.params.slugSong;

  const song = await Song.findOne({
    slug: slugSong,
    deleted: false,
    status: "active"
  })

  // console.log(song);


  const singer = await Singer.findOne({
    _id: song.singerId,
    status: "active",
    deleted: false
  }).select("fullName")

  // console.log(singer);


  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false,
    status: "active"
  }).select("title");

  // console.log(topic);

  const favoriteSong = await FavoriteSong.findOne({
    songId: song.id
  })

  song["isFavoriteSong"] = favoriteSong ? true : false;

  res.render("client/pages/songs/detail", {
    pageTitle: song.title,
    song: song,
    singer: singer,
    topic: topic
  });

}

// [PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  const typeLike: String = req.params.typeLike;
  const idSong: String = req.params.idSong;

  const song = await Song.findOne({
    _id: idSong,
    status: "active",
    deleted: false
  })

  const newLike = typeLike == "like" ? song.like + 1 : song.like - 1;

  await Song.updateOne({
    _id: idSong
  }, {
    like: newLike
  })

  res.json({
    code: 200,
    message: "Thanh cong!",
    like: newLike
  })
}

// [PATCH] /favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const typeFavorite: string = req.params.typeFavorite;

  switch (typeFavorite) {
    case "favorite":
      const existFavorite = await FavoriteSong.findOne({
        songId: idSong
      }) ;

      if(!existFavorite) {
        const record = new FavoriteSong({
          songId: idSong
        });

        await record.save();
      }
      break;
      
    case "unfavorite":
      await FavoriteSong.deleteOne({
        songId: idSong
      })
      
      break;
    default:
      break;
  }

  res.json({
    code: 200,
    message: "Thành công!"
  });
}
