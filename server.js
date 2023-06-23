const http = require("http");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://membed1.com/";

const selectors = {
  videoitem: "li.video-block",
  listingcont: "ul.listing.items",
  contentHomePage: "div.main-content",
};

const getPageItems = async (cat = "", page = "1") => {
  const newurl = url + cat + `?page=${page}`;
  const data = [];
  try {
    const response = await axios.get(newurl);
    const $ = cheerio.load(response.data);
    const videoBlocks = $(
      `${selectors.contentHomePage} ${selectors.listingcont} ${selectors.videoitem}`
    );
    videoBlocks.each(function () {
      const title = $(this).find("div.name").text().trim();
      const meta = $(this).find("div.meta").text().trim();
      const link = $(this).find("a").prop("href");
      const img = $(this).find("div.img div.picture img").prop("src");
      data.push({
        title: title,
        meta: meta,
        link: link,
        img: img,
      });
    });
  } catch (err) {
    console.log(err);
  }
  //   console.log(data);
  return data;
};

const getSearchItems = async (search = "",page='1') => {
  const newurl = url + `search.html?keyword=${search}`+ `&page=${page}`;
  const data = [];
  try {
    const response = await axios.get(newurl);
    const $ = cheerio.load(response.data);
    const videoBlocks = $(
      `${selectors.contentHomePage} ${selectors.listingcont} ${selectors.videoitem}`
    );
    videoBlocks.each(function () {
      const title = $(this).find("div.name").text().trim();
      const meta = $(this).find("div.meta").text().trim();
      const link = $(this).find("a").prop("href");
      const img = $(this).find("div.img div.picture img").prop("src");
      data.push({
        title: title,
        meta: meta,
        link: link,
        img: img,
      });
    });
  } catch (err) {
    console.log(err);
  }
  // console.log(data);
  return data;
};

const getItemPage = async (urladdon = "/the-story-of-nintendo-2023") => {
  const newurl = url +'videos/' +urladdon;
  const data = [];
  try {
    const response = await axios.get(newurl);
    const $ = cheerio.load(response.data);
    const infoblock = $("div.main-content div.video-info div.video-info-left");
    infoblock.each(function () {
      const title = $(this).find("h1").text().trim();
      const videourl = $(this)
        .find("div.watch_play div.play-video iframe")
        .prop("src")
        .substring(2);

      const description = $(this)
        .find("div.video-details div.post-entry")
        .text()
        .trim();
      const eps = [];
      $(this)
        .find("ul.listing.items.lists")
        .each(function () {
          const title = $(this).find("div.name").text().trim();
          const meta = $(this).find("div.meta").text().trim();
          const link = $(this).find("a").prop("href");
          const img = $(this).find("div.img div.picture img").prop("src");
          eps.push({
            title: title,
            meta: meta,
            link: link,
            img: img,
          });
        });
      data.push({
        title: title,
        eps: eps,
        videourl: encodeURIComponent('https://'+videourl),
        description: description,
      });
    });
  } catch (err) {
    console.log(err);
  }
  return data;
};


const getVideoPage = async (link = "https://movembed.cc/streaming.php?id=Mzk0NDQ5&title=Brahmastra+Part+One%3A+Shiva&typesub=SUB&sub=&cover=L2NvdmVyL2JyYWhtYXN0cmEtcGFydC1vbmUtc2hpdmEtMjAyMi0xNjg2NTQwMzI1LmpwZw==") => {
  const data = [];
  try {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);
    const $cont = $('ul.list-server-items li')
    $cont.each(function (){
      const title = $(this).text().trim();
      const url = $(this).prop('data-video')
      data.push({
        streamtitle:title,streamurl:url,
      })
    })
  } catch (err) {
    console.log(err);
  }
  return data
};


//-----------------------Funtions-------------------------
// getPageItems()
// getItemPage()
// getSearchItems()
//--------------------------------------------------------

//------------------Server------------------
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

//-------------HomePage--------------------
app.get("/", (req, res) => {
  // res.send('Hello')
  Promise.resolve(getPageItems()).then((s) => {
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});
//Homepage Pagination
app.get("/:page", (req, res) => {
  // res.send('Hello')
  Promise.resolve(getPageItems(cat="",page=req.params['page']!=null?req.params['page']:'1')).then((s) => {
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});
//--------------------HomePage End----------------

//--------------------CatPage--------------------
app.get('/cat/:cat',(req,res)=>{
  Promise.resolve(getPageItems(cat=req.params['cat'])).then((s) => {
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});
app.get('/cat/:cat/:page',(req,res)=>{
  Promise.resolve(getPageItems(cat=req.params['cat'],page=req.params['page'])).then((s) => {
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});

//-------------------Catpage End----------------------------

//--------------------SearchPage----------------------------

app.get('/search/:key',(req,res)=>{
  Promise.resolve(getSearchItems(search=req.params['key'])).then((s) => {
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});
app.get('/search/:key/:page',(req,res)=>{
  Promise.resolve(getSearchItems(search=req.params['key'],page=req.params['page'])).then((s) => {
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});
//---------------------SearchPage End------------------------

//--------------------Items Page----------------------------
app.get('/videos/:id',(req,res)=>{
  Promise.resolve(getItemPage(urladdon=req.params['id'])).then((s) => {
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});

//-----------------------Item Page End-----------------------

app.get('/stream/extract',(req,res)=>{//link=req.query.link
  Promise.resolve(getVideoPage(link=req.query.link))
  .then((s) => {
    console.log(req.query.link)
    if (s === []|| s===null) {
      res.statusCode = 403;
      res.send("Forbidden");
    }
    else {
      res.send(s)
    }
  });
});


app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
