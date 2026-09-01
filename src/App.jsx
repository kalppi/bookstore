import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const FIREBASE_URL =
  'https://bookstore-db08d-default-rtdb.europe-west1.firebasedatabase.app/books';

function App() {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);

  const [book, setBook] = useState({
    title: '',
    author: '',
    year: '',
    isbn: '',
    price: '',
  });

  const [colDefs] = useState([
    {
      field: 'title',
      headerName: 'Title',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'author',
      headerName: 'Author',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'year',
      headerName: 'Year',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: 'isbn',
      headerName: 'ISBN',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: '',
      field: 'id',
      width: 90,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <IconButton
          onClick={() => deleteBook(params.value)}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch(`${FIREBASE_URL}.json`)
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addKeys = (data) => {
    if (!data) {
      setBooks([]);
      return;
    }

    const booksWithIds = Object.entries(data).map(([id, book]) => ({
      ...book,
      id,
    }));

    setBooks(booksWithIds);
  };

  const inputChanged = (event) => {
    setBook({
      ...book,
      [event.target.name]: event.target.value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addBook = () => {
    const newBook = {
      ...book,
      year: parseInt(book.year, 10),
      price: parseFloat(book.price, 10),
    };

    fetch(`${FIREBASE_URL}.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then(() => {
        fetchBooks();
        handleClose();

        setBook({
          title: '',
          author: '',
          year: '',
          isbn: '',
          price: '',
        });
      })
      .catch((err) => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`${FIREBASE_URL}/${id}.json`, {
      method: 'DELETE',
    })
      .then(() => fetchBooks())
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>

      <Stack
        direction="row"
        justifyContent="center"
        sx={{ my: 2 }}
      >
        <Button variant="outlined" onClick={handleOpen}>
          Add book
        </Button>
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New book</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
            <TextField
              label="Title"
              name="title"
              value={book.title}
              onChange={inputChanged}
              fullWidth
            />

            <TextField
              label="Author"
              name="author"
              value={book.author}
              onChange={inputChanged}
              fullWidth
            />

            <TextField
              label="Year"
              name="year"
              type="number"
              value={book.year}
              onChange={inputChanged}
              fullWidth
            />

            <TextField
              label="ISBN"
              name="isbn"
              value={book.isbn}
              onChange={inputChanged}
              fullWidth
            />

            <TextField
              label="Price"
              name="price"
              type="number"
              value={book.price}
              onChange={inputChanged}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={addBook}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <div
        style={{
          height: 500,
          width: '90%',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <AgGridReact
          rowData={books}
          columnDefs={colDefs}
        />
      </div>
    </>
  );
}

export default App;