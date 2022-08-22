const express = require("express");
const app = express();
const ejs = require("ejs");
const https = require("https");
const { response } = require("express");

// 第二種方法所使用的模組
const fetch = require("node-fetch");

// api key
let mykey = "512e047a7d3ef23fd03b83e77491f29e";

// k to c
function ktoc(k) {
  return (k - 273.15).toFixed(2);
}

// middleware
app.use(express.static("public"));
app.set("view engine", "ejs");

// route
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/:lat/:lon", (req, res) => {
  //   console.log(req.params);
  //  下面這行就是把city的值拉出來
  // let city = req.params;
  // console.log(city1);

  let { lat } = req.params;
  let { lon } = req.params;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${mykey}`;
  // 在node.js 裡面 fetch 不存在不能用
  // 用兩種方式解決
  // get reqest made by node.js
  https
    .get(url, (response) => {
      // console.log("statusCode", response.statusCode);
      // console.log("headers", response.headers);

      response.on("data", (d) => {
        //JSON.parse() 方法把會把一個JSON字串轉換成 JavaScript的數值或是物件。另外
        //也可選擇使用reviver函數讓這些數值或是物件在被回傳之前做轉換。
        //JSON.parse(d)是一個sync function 所以不用 await
        let djs = JSON.parse(d);

        let { temp } = djs.main;
        let newtemp = ktoc(temp);
        res.render("weather.ejs", { djs, newtemp });
      });
    })
    .on("error", (e) => {
      console.log(e);
    });

  // // 第二種方法
  // fetch(url)
  //   .then((d) => d.json())
  //   .then((djs) => {
  //     let { temp } = djs.main;
  //     // let newtemp = ktoc(temp);

  //     res.render("weather.ejs", { djs, temp });
  //   });
});

app.listen(3000, () => {
  console.log("port3000 working");
});
