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
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.serveChemical();

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const query = document.getElementById('searchInput').value; 

    if (query === "owski.org" || query === "owski.dev" || query === "radiusowski.site") {
        document.getElementById('result').innerText = "Hey! Looks like you're already using Radius!";
    } else {
        document.getElementById('result').innerText = "Search results for: " + query; 
    }
});

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  listen(port, () => {
    console.log(`Radius listening on port ${port}`);
  });
});
