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
const { Pool } = require('pg');

const pool = new Pool({
  user: 'courses_qqoj_user',
  host: 'dpg-ck0vpoe3ktkc73ah289g-adpg-ck0vpoe3ktkc73ah289g-a',
  database: 'courses_qqoj',
  password: '2WLtK9dXKSTbPXCKFZsCO67M5Yr2wggm',
  port: 5432, // Change to your PostgreSQL port
  ssl: {
    rejectUnauthorized: false // Set to false if you have a self-signed certificate
  }
});
ssl = on
ssl_cert_file = '/path/to/ssl/server.crt'
ssl_key_file = '/path/to/ssl/server.key'

// Now you can use the pool to run queries
pool.query('SELECT * FROM your_table', (err, res) => {
  if (err) {
    console.error('Error executing query', err);
  } else {
    console.log('Query result:', res.rows);
  }
});

// End points
app.get("/", explorePage);
app.get("/classes", explorePageClasses);
app.get("/courses", coursesPage);
app.get("/depts", deptsSection);
app.post("/courses/:id", postCoursesId);
// for the front end
app.get("/classes/:id", getClassId);
app.get("/courses/:id", getCourseId);
app.post("/schedule", postCRNSchedule);
app.get("/schedule", getCRNSchedule);
app.delete("/schedule/:id",deleteCRNSchedule)
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
  CRN,
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
  this.CRN = CRN;
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
// Favorite List Classes (schedule)
function fhschedule(
  CRN,
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
  this.CRN = CRN;
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

function fhCourses(dept, course, title) {
  this.dept = dept;
  this.course = course;
  this.title = title;
  fhCourses.fhCoursesArray.push(this);
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
        classes.CRN,
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
    res.status(200).json(fhClasses.fhClassesArray);
  } catch (error) {
    console.log(error);
  }
}
// -----------Courses--------------
async function coursesPage(req, res) {
  try {
    fhCourses.fhCoursesArray = [];
    const coursePage = await axios.get(`${process.env.URL}fh/courses`);
    coursePage.data.map((course) => {
      new fhCourses(course.dept, course.course, course.title);
    });
    res.status(200).json(fhCourses.fhCoursesArray);
  } catch (error) {
    console.log(error);
  }
}

// -------------depts--------
async function deptsSection(req, res) {
  try {
    depts.deptsArray = [];
    const deptsSection = await axios.get(`${process.env.URL}fh/depts`);
    deptsSection.data.map((section) => {
      new depts(section.id, section.name);
    });
    res.status(200).json(depts.deptsArray);
  } catch (error) {
    console.log(error);
  }
}
// ---------------Course Id which the user enters when he clicks on the dept---------------
async function postCoursesId(req, res) {
  try {
    const id = req.params.id;
    fhClasses.fhClassesArray = [];
    fhCourses.fhCoursesArray = [];
    const catchCourse = await axios.get(`${process.env.URL}/fh/courses`);
    const catchClass = await axios.get(
      `${process.env.URL}/fh/depts/${id}/classes`
    );
    const filterSearchCourse = catchCourse.data.filter(
      (search) => search.dept === id
    );
    const filterSearchClass = catchClass.data.filter(
      (search) => search.dept === id
    );
    const sqlclass = `insert into classes(  CRN,
  raw_course,
  dept,
  course,
  section,
  title,
  units,
  start_time,
  end_time,
  seats,
  wait_seats,
  status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *`;

    const userClasses = filterSearchClass.map((classes) => ({
      CRN: classes.CRN || 0,
      raw_course: classes.raw_course || "TBA",
      dept: classes.dept || "TBA",
      course: classes.course || "TBA",
      section: classes.section || "TBA",
      title: classes.title || "TBA",
      units: classes.units || 0, // Providing a default value for numeric columns
      start_time: classes.start || "TBA",
      end_time: classes.end || "TBA",
      seats: classes.seats || 0,
      wait_seats: classes.wait_seats || 0,
      status: classes.status || "TBA",
    }));
    console.log(userClasses);

    client.query(sqlclass, userClasses).then((classes) => {
      // Assuming classes.rows contains the class information
      const classInfo = {
        class: `Class ${classes.rows[0].title} has been added successfully`,
        class_id: classes.rows[0].crn,
      };

      const sqlcourses = `INSERT INTO courses (dept, course, title) VALUES ($1, $2, $3) RETURNING *`;

      filterSearchCourse.map((course) => {
        userCourse = [course.dept, course.course, course.title];
      });

      client.query(sqlcourses, userCourse).then((courses) => {
        // Assuming courses.rows contains the course information
        const courseInfo = {
          course: `Course ${courses.rows[0].title} has been added successfully`,
          id: courses.rows[0].dept,
        };

        // Combine class and course information into a single response object
        const combinedResponse = {
          classInfo,
          courseInfo,
        };

        // Send the combined response as JSON
        res.status(201).json(combinedResponse);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
async function getClassId(req, res) {
  try {
    fhClasses.fhClassesArray = [];
    const id = req.params.id;
    const catchClass = await axios.get(
      `${process.env.URL}/fh/depts/${id}/classes`
    );
    const fhClassesArray = catchClass.data.map((classes) => ({
      CRN: classes.CRN,
      raw_course: classes.raw_course,
      dept: classes.dept,
      course: classes.course,
      section: classes.section,
      title: classes.title,
      units: classes.units,
      start: classes.start,
      end: classes.end,
      seats: classes.seats,
      wait_seats: classes.wait_seats,
      status: classes.status,
      type: classes.times[0].type,
      days: classes.times[0].days,
      start_time: classes.times[0].start_time,
      end_time: classes.times[0].end_time,
      Professor: classes.times[0].instructor[0],
      location: classes.times[0].location,
    }));
    res.status(200).json(fhClassesArray);
  } catch (error) {
    console.log(error);
  }
}
async function getCourseId(req, res) {
  try {
    const id = req.params.id;
    const catchCourse = await axios.get(`${process.env.URL}/fh/courses`);

    const filterSearchCourse = catchCourse.data.filter(
      (search) => search.dept === id
    );

    res.status(200).json(filterSearchCourse);
  } catch (error) {
    console.log(error);
  }
}
// schedule function
async function postCRNSchedule(req, res) {
  try {
    const ApiClass = req.body;
    console.log(ApiClass);
    const sql = `insert into schedule(CRN ,
  raw_course,
  dept,
  course ,
  section,
  title,
  units,
  start_time,
  end_time,
  seats,
  wait_seats,
  status,
  type,
  days,
  Professor,
  location)  values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning *`;
    const inputApi = [
      ApiClass.CRN,
      ApiClass.raw_course,
      ApiClass.dept,
      ApiClass.course,
      ApiClass.section,
      ApiClass.title,
      ApiClass.units,
      ApiClass.start_time,
      ApiClass.end_time,
      ApiClass.seats,
      ApiClass.wait_seats,
      ApiClass.status,
      ApiClass.type,
      ApiClass.days,
      ApiClass.Professor,
      ApiClass.location,
    ];
    client.query(sql,inputApi).then((sched)=>{
      sched.rows.map((item)=> res.status(201).json(item)
      
      )
    })
  } catch (error) {
    console.log(error);
  }
}
function getCRNSchedule(req, res){
  try {
    const sql=`select * from schedule`
    client
    .query(sql)
    .then((data)=>{
      res.json({classes:data.rows})
    })
    
  } catch (error) {
    console.log(error);
  }
} 

function deleteCRNSchedule(req, res){
  try {
    const crn=req.params.id;
    const sql=`delete from schedule where CRN=$1`;
const userInput=[crn];

    client
    .query(sql,userInput)
    .then((data)=>{
      res.status(204).end()
    })
    
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
