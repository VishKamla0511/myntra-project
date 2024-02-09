create table wishlists(
wishlist_id int primary key auto_increment,
user_id int, foreign key (user_id) references users(user_id) on delete cascade,
product_id int, foreign key (product_id) references products(product_id)on delete cascade,
is_active boolean,
is_deleted boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);