import { ChemicalServer } from "chemicaljs";
import next from "next";

const [app, listen] = new ChemicalServer();
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
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
