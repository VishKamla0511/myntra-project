create table users(
user_id int primary key auto_increment,
name varchar(20) not null,
phone_no int unique,
email varchar(50) not null,
password varchar(50) not null,
address varchar(50) not null,
is_active boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
otp int
);