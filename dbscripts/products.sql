create table products (
product_id int primary key auto_increment,
name varchar(20) not null,
description text not null,
type enum ('MEN','WOMEN'),
price float not null,
discount float,        
rating varchar(10) , 
total_rating int not null,
image varchar(50) not null,
is_active boolean,
is_deleted boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);