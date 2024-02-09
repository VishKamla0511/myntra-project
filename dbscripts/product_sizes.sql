create table product_sizes(
product_size_id int primary key auto_increment,
product_id int, foreign key (product_id) references products(product_id) on delete cascade,
size_id int, foreign key (size_id) references sizes(size_id),
is_active boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);