const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const date = require(__dirname + "/date.js");
const _ = require("lodash");


const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//workItems = [];
//items = [];

mongoose.connect("mongodb+srv://jubi-admin:jubiganda@cluster0.bspnd.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome"
});
const item2 = new Item({
  name: "Yeah"
});
const item3 = new Item({
  name: "Yo!"
});

const defaultItems = [item1, item2, item3];

const listScheme = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List",listScheme);





app.get("/", function(req,res){

  Item.find(function(err, foundItems){
//avoid default duplication from the database, 1.checkin first if the database is empty
  if (foundItems.length === 0){

//2.if the database is empty, it will execute insert many.
    Item.insertMany(defaultItems, function(err){
     if(err){
       console.log(err);
     }else{
       console.log("Successfully Save items to Db");
     }
    });
  //4. redirect to home route to read the else statement to show the content
    res.redirect("/");
  }
//3. if the database already have content it will skip the inserting but only show the content
  else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  });
//let day = date();
 });

 app.get("/:customListName", function(req,res){
   const customListName = _.capitalize(req.params.customListName);
   List.findOne({name: customListName}, function(err,foundlist){
     if(!err){
       if(!foundlist){
         //create new item
         const list = new List({
           name: customListName,
           items: defaultItems
         });
         list.save();
         res.redirect("/" + customListName);
       }else{
         //show existing item
         res.render("list",{listTitle: foundlist.name, newListItems: foundlist.items})
       }
     }
   });


 });
app.post("/", function(req, res){
  //get item from the view input
  const itemName = req.body.newItems;
  //get name of the title
  const listName =req.body.list;
//add the item to the model database
const addedItem = new Item({
  name: itemName
});

if(listName === "Today"){
  //shortcut to save in the database
  addedItem.save();
  //redirect to home route to display the added item
  res.redirect("/");
}
else{
  List.findOne({name:listName}, function(err,foundlist){
    foundlist.items.push(addedItem);
    foundlist.save();
    res.redirect("/" + listName);
  })
}



//   if(req.body.list === "Work"){
//     workItems.push(item);
//     res.redirect("/work");
//   }
//   else{
//   items.push(item);
//   res.redirect("/");
// }

});

app.post("/delete", function(req,res){
const checkedItem = (req.body.checkbox);
const listName =  (req.body.listName);

if(listName === "Today"){
  Item.findByIdAndRemove(checkedItem,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully Deleted");
      res.redirect("/");
    }
  });
}else{
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id:checkedItem}}},function(err,foundlist){
    if(!err){
      res.redirect("/" + listName);
    }
  });
}


});

// app.get("/work", function(req,res){
// res.render("list",{listTitle: "Work", newListItems: workItems});
// });

app.post("/work", function(req,res){
  let item = req.body.newItems;
  workItems.push(item);
  res.redirect("/work");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port,function(){
  console.log("Server has started Successfully");
});
