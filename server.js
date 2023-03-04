const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');



app.set('view engine', 'ejs');

app.use(bodyParser.json());

    
app.use(bodyParser.urlencoded({
    extended: true,
})
);

// set access for static files in the /resources folder
// for example, in ejs: href="/css/style.css" would reference the file "/resources/css/style.css"
app.use(express.static(__dirname + '/resources'));

// Sets "/" location to redirect to /login page. We may want to change this to /home (or have /home located here at /)
app.get("/", (req, res) => {
    res.redirect("/main");
});

app.get("/main", (req, res) =>{
    res.render("pages/main");
});

async function generateURL(req){
    const cocktailName = req.body.cocktail;
    var myURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktailName;
    console.log(myURL);
    return myURL;
}

// main axios call
app.post("/searchForDrink", async (req, res) =>{
    const formattedURL = await generateURL(req);
    var retDrink;
    return await axios({
        // url for cocktail DB
        url: formattedURL,
        method:'GET',
        dataType:'json',
        headers: {
            'Accept-Encoding': 'application/json'
        }
    })
    .then(results => {
        // verifies developer expects these results
        console.log("Successful call to Cocktail DB");
        // return only the first as directed in the instructions 
        retDrink = results.data.drinks[0];
        res.render("pages/searchResults", retDrink);
    })
    .catch(error => {
        console.log("Failed to call Cocktail DB");
        res.render("pages/main", {
            message: "We are sorry, but an error in calling the Cocktail DB has occured! Error: " + error.message + ". Please enter a valid cocktail!" ,
            error: true
        });
    });
});

app.get("/aboutMe", (req, res) =>{
    res.render("pages/aboutMe")
});




app.listen(3000);
console.log('Server is listening on port 3000');