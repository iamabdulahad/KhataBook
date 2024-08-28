const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir(`./files`, function (err, files) {
    if (err) console.log(err);

    res.render("index", { files: files });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create/:filename", (req, res) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2);

  const currentDate = `${day}-${month}-${year}`;

  console.log(currentDate);

  let baseFilePath = `./files/${currentDate}`;
  let filePath = `${baseFilePath}.txt`;
  let fileNumber = 1;

  while (fs.existsSync(filePath)) {
    filePath = `${baseFilePath}_${fileNumber}.txt`;
    fileNumber++;
  }

  fs.writeFile(filePath, `${req.body.textarea}`, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send("An error occurred while writing the file.");
    }

    res.redirect("/");
  });
});
app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
    if (err) console.log(err);

    res.render("edit", { data: data, filename: req.params.filename });
  });
});

app.post("/update/:filename", (req, res) => {
  fs.writeFile(`./files/${req.params.filename}`, req.body.textarea, (err) => {
    if (err) return res.send(err);
    res.redirect("/");
  });
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    if (err) console.log(err);

    res.redirect("/");
  });
});

app.listen(3000);
