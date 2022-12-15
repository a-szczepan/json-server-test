const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./src/db.json");

const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3200;

server.use(middlewares);

server.get("/perfumes/filter", (req, res) => {
  const db = router.db.toJSON();
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 20;
  const gender = req.query.gender ? [req.query.gender].flat() : [];
  const brand = req.query.brand ? [req.query.brand].flat() : [];
  const group = req.query.group ? [req.query.group].flat() : [];

  const output = db.perfumes
    .map((perfume) => {
      return {
        ...perfume,
        mainAccords: perfume.mainAccords.map((e) => e.accord),
      };
    })
    .filter((perfume) =>
      group.length > 0
        ? perfume.mainAccords.some((i) => group.includes(i))
        : perfume
    )
    .filter(
      (perfume) =>
        (brand.length > 0 ? brand.includes(perfume.brand) : perfume) &&
        (gender.length > 0 ? gender.includes(perfume.gender) : perfume)
    );

    if(page===0){
      res.status(200).json(output);
    } else {
      res.status(200).json(output.slice((page - 1) * limit, page * limit));
    }
  
});

server.use(router);

server.listen(port);
