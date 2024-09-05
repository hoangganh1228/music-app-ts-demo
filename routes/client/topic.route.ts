import { Router, Request, Response } from "express";
import Topic from "../../models/topic.model";

const router:Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  })

  res.render("client/pages/topics/index");
});

export const topicRoutes: Router = router;