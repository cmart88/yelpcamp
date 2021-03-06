const mongoose = require("mongoose"),
    Campground = require("../models/campground"),
    { places, descriptors } = require("./seedHelpers"),
    cities = require("./cities"),
    axios = require("axios");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// async function seedImg() {
// 	try {
// 		const resp = await axios.get('https://api.unsplash.com/photos/random', {
// 			params : {
// 				client_id   : '2MecWtynsYIo4JG7_WxvNbRZWFvkB2-nZ0S-FsGPazg',
// 				collections : 1114848
// 			}
// 		});
// 		return resp.data.urls.small;
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "61d62c4956cf6abd96e02792",
            images: [
                {
                    url: "https://res.cloudinary.com/dtgfvptng/image/upload/v1642896657/YelpCamp/vta4rra7bzyst46iuu3x.jpg",
                    filename: "YelpCamp/vta4rra7bzyst46iuu3x",
                },
                {
                    url: "https://res.cloudinary.com/dtgfvptng/image/upload/v1642896663/YelpCamp/zlp8oj20gl1obsmkhlto.jpg",
                    filename: "YelpCamp/zlp8oj20gl1obsmkhlto",
                },
                {
                    url: "https://res.cloudinary.com/dtgfvptng/image/upload/v1642896669/YelpCamp/fkf9t3gttwuidssymtta.jpg",
                    filename: "YelpCamp/fkf9t3gttwuidssymtta",
                },
            ],
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, similique! Harum, voluptates illo. Eligendi necessitatibus rem consequatur porro repellat, adipisci illum esse doloribus sequi voluptatem. Laborum voluptatibus animi explicabo dolor.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
        });
        await camp.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});
