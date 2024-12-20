import express from "express";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book_notes",
    password: "ciao",
    port: 5432
  });
await db.connect();

let myNotes = [];
try {
    const queryResult = await db.query("SELECT id, isbn, title, date_of_read, rate, abstract, notes FROM reads JOIN books ON reads.book = books.isbn ORDER BY title ASC;");
    myNotes = queryResult.rows;
} catch (error) {
    console.error(error);
}

db.close;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {notes: myNotes});
});

app.get("/:id", (req, res) => {
    const requestedIsbn = req.params.id;
    const requestedBook = myNotes.find(note => note.isbn === requestedIsbn);
    res.render("book-view.ejs", {book: requestedBook});
});

app.listen( port, () => console.log(`Listening on port ${port}`) );