import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
    // console.log(req.params.slugTopic);

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