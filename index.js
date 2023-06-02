const fs = require("fs");
const http = require('http'); //Gives us netwroking capabilities
const url = require('url');
const replaceTemplate = require('./modules/replacetemplate')

////////////    Files   ////////////
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERRORRR");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}.\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });
// console.log("Waiting");

////////////    Server  ////////////

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card-template.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);    //in dataobject we have an array of all the object {this will turn JSON code which is actually string into js object}


const server = http.createServer((req, res) => {
const {query, pathname} = url.parse(req.url, true);

// console.log(req.url);
//const pathName = req.url;
// console.log(url.parse(req.url, true));  //to parse all of the variable in the url

    //overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type':'txt.html'});  
        
        const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    

    //product page
    } else if (pathname === '/product'){
        //console.log(query);
        res.writeHead(200, {'Content-type': 'txt.html'});
        const product = dataObject[query.id];        
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    
    //api
    } else if(pathname === '/api'){
            res.writeHead(200, {'Content-type':'application/json'});  //to tell the browser that we are sending JSON format
            res.end(data);
    }

    //not found
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
          });
          res.end('<h1>Page not found!</h1>');
        }
});

server.listen(8000,'127.0.0.1', () =>{
    console.log("Listening to request on port 8000");
});