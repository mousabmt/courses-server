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
app.get("/classes", explorePageClasses);
app.get("/courses", coursesPage);
app.get("/depts", deptsSection);

// Datas || constructors


//-----------years Data
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

// ------------Classes Data-------------

function fhClasses(
  raw_course,
  dept,
  course,
  section,
  title,
  units,
  start,
  end,
  seats,
  wait_seats,
  status
) {
  this.raw_course = raw_course;
  this.dept = dept;
  this.course = course;
  this.section = section;
  this.title = title;
  this.units = units;
  this.start = start;
  this.end = end;
  this.seats = seats;
  this.wait_seats = wait_seats;
  this.status = status;
  fhClasses.fhClassesArray.push(this);
}
//----------Courses Data-------

function fhCourses(dept,course,title){
  this.dept=dept
  this.course=course
  this.title=title
  fhCourses.fhCoursesArray.push(this)
}
// -----------departments--------------
function depts(id, name) {
  this.id = id;
  this.name = name;
  depts.deptsArray.push(this);
}

// -------------------------

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
// -----------Classes--------------
async function explorePageClasses(req, res) {
  try {
    fhClasses.fhClassesArray = [];

    const exploreclasses = await axios.get(`${process.env.URL}fh/classes`);
    exploreclasses.data.map((classes) => {
      new fhClasses(
        classes.raw_course,
        classes.dept,
        classes.course,
        classes.section,
        classes.title,
        classes.units,
        classes.start,
        classes.end,
        classes.seats,
        classes.wait_seats,
        classes.status
      );
    });
    res.status(200).json(fhClasses.fhClassesArray)
  } catch (error) {
    console.log(error);
  }
}
// -----------Courses--------------
async function coursesPage(req,res){
  try {
    fhCourses.fhCoursesArray=[]
    const coursePage=await axios.get(`${process.env.URL}fh/courses`);
    coursePage.data.map((course)=>{
      new fhCourses(course.dept,course.course,course.title)
    })
    res.status(200).json(fhCourses.fhCoursesArray)
  } catch (error) {
    console.log(error);
  }
}

// -------------depts--------
async function deptsSection(req,res){
  try {
    depts.deptsArray=[]
    const deptsSection=await axios.get(`${process.env.URL}fh/depts`);
    deptsSection.data.map((section)=>{
      new depts(section.id,section.name)
    })
    res.status(200).json( depts.deptsArray)
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
