import { ChemicalServer } from "chemicaljs";
import next from "next";

const [app, listen] = new ChemicalServer({
  default: "uv",
  uv: true,
  rammerhead: true,
  experimental: {
    scramjet: true,
    meteor: true,
  },
});
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, turbopack: true });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.serveChemical();

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  listen(port, () => {
    console.log(`Radius listening on port ${port}`);
  });
});
