`use strict`;
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.DBURL);
const port = process.env.PORT || 3005;

// End points
app.get("/", explorePage);
app.get("/", explorePageCourses);

// Datas || constructors
function Currentyear(year, term) {
  this.year = year;
  this.term = term;
  Currentyear.currentyearArray.push(this);
}
// -------------------------
function prevYears(year, term) {
  this.year = year;
  this.term = term;
  prevYears.prevYearsArray.push(this);
}
// ------------years-------------




// -------------------------
// function fhCourses() 
async function explorePage(req, res) {
  try {
    Currentyear.currentyearArray = [];
    prevYears.prevYearsArray = [];
    const explore = await axios.get(`${process.env.URL}fh`);
    const test = new Array(explore.data.current).map((item) => {
      new Currentyear(item.year, item.term);
    });

    console.log(explore.data.terms);
    explore.data.terms.map((course) => {
      new prevYears(course.year, course.term);
    });
    res.status(200).json({
      current_year: Currentyear.currentyearArray,
      previous_years: prevYears.prevYearsArray,
    });
  } catch (error) {
    console.log(error);
  }
}
// -------------------------
async function explorePageCourses(req,res){
    try {
        fhCourses.fhCoursesArray = [];
       
        const explore = await axios.get(`${process.env.URL}fh`);
        const test = new Array(explore.data.current).map((item) => {
          new Currentyear(item.year, item.term);
        });
    
     
      } catch (error) {
        console.log(error);
      }

}


client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  app.listen(port, () => {
    `Up And Running On Port ${port}`;
  });
});
