import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { searchRoutes } from "./search.route";
import { favoriteSongRoutes } from "./favorite-song.route";


const clientRoutes = (app: Express): void => {
  app.use("/topics", topicRoutes);

  app.use("/songs", songRoutes);

  app.use(`/search`, searchRoutes);

  app.use(`/favorite-songs`, favoriteSongRoutes);

}

export default clientRoutes