create table sizes(
size_id int primary key auto_increment,
name varchar(10) not null,
is_active boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);