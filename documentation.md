# NYC Apartments for Rent

---

Name: Andrew Gordon

Date: 4/28/20

Project Topic: NYC Apartments

---

## Requirements

### 1. Fulfillment of Midterm Project Requirements
Midterm requirements have their own section at the bottom of this page. 

2 Schemas:
- `apartmentSchema`: Defines the fields that an apartment listing must have 
- `reviewSchema`: Defines the fields that a review for an apartment must have


### 2. Live Updates
route: `/chatRoom`
A chat box where users can communicate with one another, allowing them to ask questions, get advice from more experienced renters and even find a roommate.

The page is generated using `chatroom.handlebars`.


### 3. View Data
Form submission:    `\create` and `\api\create`

Chat room:          `\chatroom`
Create listing:     `\create`
Home page:          `\`
Manhattan Listings: `\listings\manhattan` (and all the other boroughs have their respective listings page)
Specific listing:   `\listing\:slug`

About page:         `\about`


### 4. API
2 POST endpoints
Write a review:   `/api/listing/writeReview`
Create a listing: `/api/create`

2 DELETE endpoints
Delete oldest review: `/listing/:id/latestReview`
Delete listing:       `/listing/:id`

4 additional endpoints
Raw data with all listings: `/api/allListingsRaw`
About page:                 `/about`
Create a new listing:       `/create`
Page with selected listing: `/listing/:curr`


### 5. Modules
`./models/Apartments.js`


### 6. NPM Packages
I used `nodemailer` and `moment`.
nodemailer enabled me to create a contact form so that users can ask the landlord of the listing specific questions. I used this package in my `/sendMail` endpoint.
I used moment to get the current time and format it how I wanted it when a user created a new listing. This gives the user a better idea of how long an apartment has been on the market.


### 7. User Interface
In my `main.css` file, you'll see that I made a bunch of classes to organize my html and make it look nicer. 


## Midterm Requirements

### 1. Data Format and Storage

Data point fields:
- `title`:         ...       `Type: String`
- `location`:      ...       `Type: String`
- `price`:         ...       `Type: String`
- `amenities`:     ...       `Type: Array`
- `bedrooms`:      ...       `Type: Int`
- `bathrooms`:     ...       `Type: Int`
- `url extension`: ...       `Type: String`
- `description`:   ...       `Type: String`


### 2. Add New Data

HTML form route: `/create`
POST endpoint route: `/api/create`

Example Node.js POST request to endpoint: 
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/create',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        title: 'Manhattan Dream Apartment',
        location: 'Manhattan, NY',
        price: "$2,000",
        amenities: "Pool, Sauna",
        bedrooms: 2,
	bathrooms: 1.5,
  slug: ManhattanApt,
	description: "The apartment you've been looking for. Located in the heart of the Financial District right by the 4, 5 and 6..."
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});


### 3. View Data

Home GET endpoint: `/`
JSON GET endpoint: `/api/allListingsRaw`


### 4. Search Data

Search Field: title and location
In the example above, if we posted "Manhattan Dream Apartment, Manhattan, NY", it would continue to display upon typing "mANhaT" and then dissapear once we modified it to "mANhaTx".
If we typed "Dream Apartment, Manhattan, NY", then the listing would be displayed. 


### 5. Navigation Pages

The first 5 will give the user all of the postings in that borough and the sixth will give the user the newest posting. 
1. Manhattan -> `/listings/Manhattan`
2. Queens -> `/listings/Queens`
3. Brooklyn -> `/listings/Brooklyn`
4. Bronx -> `/listings/Bronx`
5. Staten Island -> `/listings/StatenIsland`
6. Newest Listing -> `/NewestListing`

In addition to these, as postings are created, their amenities are added to the navigation bar and users can click those amenities to filter listings that have the desired amenity (ex. pool, sauna, etc.).
