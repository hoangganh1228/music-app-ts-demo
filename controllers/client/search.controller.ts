import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// import { convertToSlug } from "../../helpers/convertToSlug";


// [GET] /search/:type
export const result = async (req: Request, res: Response) => {
  const keyword: string = `${req.query.keyword}`;
  
  const type: string =  `${req.params.type}`


  let newSongs = [];

  if(keyword) {
    const keywordRegex = new RegExp(keyword, "i");

    const unicodeSlug = convertToSlug(keyword);

    const slugRegex = new RegExp(unicodeSlug, "i");

    const songs = await Song.find({
      $or: [
        { slug : slugRegex },
        { title: keywordRegex }
      ]
    })
    
    // console.log(songs);
    

    if(songs.length > 0) {
      for(const song of songs) {
        const infoSinger = await Singer.findOne({
          _id: song.singerId,
        })
        
        newSongs.push({
          id: song.id,
          title: song.title,
          avatar: song.avatar,
          slug: song.slug,
          like: song.like,
          infoSinger: {
            fullName: infoSinger.fullName
          }
        })
      }
    }
  }
  switch (type) {
    case "result":
      res.render("client/pages/search/result", {
        pageTitle: `Kết quả: ${keyword}`,
        keyword: keyword,
        songs: newSongs
      });
      break;
    case "suggest":
      res.json({
        code: 200,
        message: "Thành công!",
        songs: newSongs
      })
      break;
    default:
      res.json({
        code: 400,
        message: "Lỗi!"
      });
      break;
  }
}