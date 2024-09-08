import { Request, Response } from "express";
import { systemConfig } from "../../config/config";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";

// [GET] /admin/songs/
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false
  });

//   console.log(songs);

  res.render("admin/pages/songs/index", {
    pageTitle: "Quản lý bài hát",
    songs: songs
  });
};

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  }).select("title");

  const singers = await Singer.find({
    deleted: false
  }).select("fullName");

  res.render("admin/pages/songs/create", {
    pageTitle: "Thêm mới bài hát",
    topics: topics,
    singers: singers
  });
};

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  const dataSong = {
      title: req.body.title,
      topicId: req.body.topicId,
      singerId: req.body.singerId,
      description: req.body.description,
      status: req.body.status,
      avatar: req.body.avatar
  };

  const song = new Song(dataSong);
  await song.save();
  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
}