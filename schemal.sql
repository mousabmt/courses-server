create table
    if not exists courses (
        dept varchar(200),
        course varchar(200),
        title varchar(200)
    );

create table
    if not exists classes (
        CRN integer,
        raw_course varchar(200),
        dept varchar(10),
        course varchar(25),
        section varchar(100),
        title varchar(200),
        units integer,
        start_time varchar(200),
        end_time varchar(200),
        seats integer,
        wait_seats integer,
        status varchar(200)
    );

create table
    if not exists schedule (
        CRN integer,
        raw_course varchar(200),
        dept varchar(10),
        course varchar(25),
        section varchar(100),
        title varchar(200),
        units integer,
        start_time varchar(200),
        end_time varchar(200),
        seats integer,
        wait_seats integer,
        status varchar(200),
        type varchar(200),
        days varchar(200),
        Professor varchar(200),
        location varchar(200)
    );