# Shopping Cart App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

Welcome to our E-Commerce Shopping Web Application! This application allows users to search for products, choose products, apply filters, and add, remove, and manage items in their shopping cart. 

## Steps to be followed for project set-up

* Clone this repository: `git clone https://github.com/Eshagupta0106/shopping-cart-team1.git`
* Navigate to the project directory: `cd shopping-cart-team1`
* Navigate to the client-side folder: `cd client-side`
* Install node modules: `npm-install`
* Run the angular code : `ng serve --host 0.0.0.0 --port 5000`
If you encounter any errors regarding installations of below modules, follow:
 `npm install -g @angular/cli`, `npm install flowbite`, `npm install @fortawesome/fontawesome-free`

### To run application and store data in mongodb

* You will have to uncomment some lines of code in client-side->src->app
1. catalog -> catalog.component.html
Lines
-> uncomment 24, 25
-> comment 26, 27
2. filled-cart -> filled-cart.component.html
Lines
-> uncomment 24, 25
-> comment 26, 27
3. product -> product.component.html
Lines
-> uncomment 11, 12
-> comment 13, 14
4. admin-update-product -> admin-update-product-component.ts
Lines
-> comment 46

Open other terminal and make sure you are in root directory `shopping-cart-team1`
Give command `./run.bat`
Then choose 1

### To run application and store data in mysql

* You will have to uncomment some lines of code in client-side->src->app
1. catalog -> catalog.component.html
Lines
-> uncomment 26, 27
-> comment 24, 25
2. filled-cart -> filled-cart.component.html
Lines
-> uncomment 26, 27
-> comment 24, 25
3. product -> product.component.html
Lines
-> uncomment 13, 14
-> comment 11, 12

* Open Mysql command line client
* `create schema shopping_cart_team_1_db'
* In serverside-mysql -> src/main/resources -> application.properties
* Replace below lines with your mysql username and password
  
`spring.datasource.username= <your-mysql-username>`

`spring.datasource.password= <your-mysql-password>`

If mongodb is already running terminate it, Open other terminal and make sure you are in root directory `shopping-cart-team1`
Give command `./run.bat`
Then choose 2

* All the required tables will be created in database
https://drive.google.com/drive/folders/1AIFbucwOCFa6_o9jtDblW_FUH-ujm7Sz?usp=sharing
Open the link above, 
copy contents of product.sql and insert the records to product table
then copy contents of image.sql and insert records to image table
then you should be able to see products in catalog page of our website. 

## Development server

Server for Client-side: `ng serve --host 0.0.0.0 --port 5000`

Server for Server-side: 'http://localhost:8093'

## Usage

* Open the application in your web browser.
* Search for products.
* Browse the available products.
* Apply filters like category, price, rating and availability in stock.
* Click on the product you want to buy and and select the quantity and then click the 'Add to Cart' or 'Buy Now'.
* If the user is not registered/signed in already, clicking on 'Add to Cart' or 'Buy Now' will redirect to sign-in page.
* Can also click the "Cart" icon next to a product image in the catalog page to add it to your cart.
* Navigate to the cart page to view and manage your items.
* Remove items from the cart or update quantities as needed.
* Login to Admin account
* Add product and view the new product in admin dashboard.
* Edit or Remove the new product from dashboard.

## Features

* Search for products.
* Browse a collection of products.
* Can apply filters like category, price, rating and availability in stock.
* Add products to the cart.
* After successful sign-up/sign-in jwt tokens are generated by server and are sent to client which in turn stores as a cookie.
* 'currentUser' jwt token stored as cookie will be sent in authorization header while a user tries to add products to cart, view cart, edit cart items or remove cart items for authentication.
* View and manage items in the cart.
* Calculate the total cost of items in the cart.
* One need to Sign In before adding items to cart/buying.
* Buy Product.
* Generates invoice of all the products bought.
* After placing order, the cart will be cleared.
* Responsive design for mobile and desktop.
* Role based access control for admin and user.
* Admin has access to add product, update product and delete product

## FAQ

Q: Can I use this app on mobile devices?
A: Yes, the app is responsive and works well on both desktop and mobile devices.
