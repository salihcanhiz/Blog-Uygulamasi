const express = require("express");

const app = express();
const cookieParser=require("cookie-parser");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use( express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/account", authRoutes);
app.use("/admin", adminRoutes);
app.use(userRoutes); 

const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");

Blog.belongsTo(User, {
    foreignKey: {
        allowNull: true
    }
});// Foreign key bloğa eklenir eğer aynı formda hasMany kullanılmış olsaydı User'a eklenecekti.
User.hasMany(Blog);



Blog.belongsToMany(Category, { through: "blogCategories"});//Many to Many ilişki tipi ayrı bir tablo oluşturulur.
Category.belongsToMany(Blog, { through: "blogCategories"});
 //Bağlantılı verilerde silinme olduğunda diğer verinin silinmesi önler. 
   // onDelete:"SET NULL",
   // onUpdate:"SET NULL",
(async () => {
    await sequelize.sync({ force: true }); // Alter olursa Güncelleme durumunda çalışır 
    await dummyData();
})();

app.listen(3000, function() {
    console.log("listening on port 3000");
});



// ilişkiler
// one to many
// Category.hasMany(Blog, {
//     foreignKey: {
//         name: 'categoryId',
//         allowNull: false,
//         // defaultValue: 1
//     },
   
// });
// Blog.belongsTo(Category);