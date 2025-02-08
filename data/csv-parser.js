const fs = require('fs');
const csv = require('csv-parser');
const results = [];

fs.createReadStream('../downloads/goodreads_library_export.csv')
  .pipe(csv())
  .on('data', (data) => {

    // if I haven't read the book yet, it should be ignored
    if (!data['Date Read'] || data['Date Read'].trim() === '') return;

    // only some of the headers should be taken into account
    const filteredData = {
      'Book Id': data['Book Id'],
      'Title': data['Title'],
      'Author': data['Author'],
      'My Rating': data['My Rating'],
      'Number of Pages': data['Number of Pages'],
      'Year Published': data['Year Published'],
      'Original Publication Year': data['Original Publication Year'],
      'Date Read': data['Date Read'],
      'Bookshelves': data['Bookshelves'],
      'My Review': data['My Review'],
    };
    results.push(filteredData);
  })
  .on('end', () => {
    
    // create a JSON file to store the data
    fs.writeFile("booksData.json", JSON.stringify(results, null, 2), (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture du fichier JSON:", err);
        } else {
          console.log("Fichier JSON créé avec succès !");
        }
    });
  });