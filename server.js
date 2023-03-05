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

// main axios call
app.post("/searchForDrink", async (req, res) =>{
    var data = req.body.product;

    let urls = [
        "https://data.unwrangle.com/api/getter?platform=amazon_search&search=" + data + "&api_key=a00652c2d93f5b8ab5fd50674e849fcd13ba55ee",
        "https://data.unwrangle.com/api/getter?platform=bestbuy_search&search=" + data + "&api_key=a00652c2d93f5b8ab5fd50674e849fcd13ba55ee",
        "https://data.unwrangle.com/api/getter?platform=costco_search&search=" + data + "&api_key=a00652c2d93f5b8ab5fd50674e849fcd13ba55ee",
        "https://data.unwrangle.com/api/getter?platform=samsclub_search&search=" + data + "&api_key=a00652c2d93f5b8ab5fd50674e849fcd13ba55ee"
      ];

      const requests = urls.map((url) => axios.get(url));

      axios.all(requests).then((responses) => {
        responses.forEach((resp) => {
          let msg = {
            server: resp.headers.server,
            status: resp.status,
            fields: Object.keys(resp.data).toString(),
          };
          console.info(resp.config.url);
          console.table(msg);
          console.log(msg);
          console.log(resp.data);
        });
      });

});

app.get("/aboutMe", (req, res) =>{
    res.render("pages/aboutMe")
});




app.listen(3000);
console.log('Server is listening on port 3000');