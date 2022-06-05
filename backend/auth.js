const express = require("express");
const multer=require('multer');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const photo_upload=require("./upload.js")
app.use(cors());
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../photos"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://testabc112:test1234@cluster0.vmz8k.mongodb.net/abc?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.post("/create_account",(req, res) => {  
  
    client.connect(err => {

        const collection = client.db("abc").collection("abc11");
        
         
            collection.insertOne({ first_name: req.body.first_name,last_name: req.body.last_name,email: req.body.email ,password: req.body.password,photo_publish:[],accesslevel:req.body.access_level,requestlevel:false,photo_publish_request:[]});

       
      });
  });
  app.post("/full_account_details",(req, res) => {
    client.connect(err => {
      const collection = client.db("abc").collection("abc11")
      collection.find({email:req.body.email}).toArray(function(err, docs) {
        res.send(docs)
      });
    });
  })
  app.post("/email_check",(req, res) => {  
      client.connect(err => {
  
          const collection = client.db("abc").collection("abc11");
          collection.find({email:req.body.email}).toArray(function(err, docs) {
            res.send(docs)
          });         
        });
    });

    app.get("/get_all_photo",async (req, res) => { 
    client.connect(err => {
    const collection = client.db("abc").collection("abc11")
    collection.find({}).toArray(function(err, docs) {
      res.send(docs)
    });
})  
    
    }); 
    app.post("/admin_saved_article",async (req, res) => { 
      client.connect(err => {
      const collection = client.db("abc").collection("abc11")
      collection.find({email:req.body.email}).toArray(function(err, docs) {
        res.send(docs)
      });
  })  
      
      }); 
    app.post("/publish_photo",upload.single('image'),async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11"); 
          //collection.updateMany({},{$set:{photo_publish: []}})  
          //collection.updateMany({},{$set:{photo_publish_request: []}})                 
        collection.find({email:req.body.email,photo_publish:{$elemMatch:{url:req.file.filename}}}).toArray(function(err, docs) {
           if(docs.length==0)
           {
            collection.updateOne({email:req.body.email},{$push:{photo_publish: {url:req.file.filename,data:req.body.text_data,email:req.body.email}}})    
            res.send({s1:"success"})          
           }
          });
          
          
          
          
        });
        
    });  
    app.post("/request_photo",upload.single('image'),async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11"); 
          collection.find({email:req.body.email,photo_publish_request:{$elemMatch:{url:req.file.filename}}}).toArray(function(err, docs) {
            if(docs.length==0)
            {
              collection.updateOne({email:req.body.email},{$push:{photo_publish_request: {url:req.file.filename,data:req.body.text_data,superadmin_ask_request:true,superadmin_grant_request:null,superadmin_update_request:null,email:req.body.email}}})              
              res.send({s1:"success"})  
            }
           });            
        });
    });  
    app.post("/provideblogaccess",async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11");
          collection.updateOne({email:req.body.email,photo_publish_request:{$elemMatch:{url:req.body.url}}},{$set:{"photo_publish_request.$.superadmin_grant_request":true}})
          collection.find({email:req.body.email,photo_publish:{$elemMatch:{url:req.body.url}}}).toArray(function(err, docs) {
            if(docs.length==0)
            {
            collection.updateOne({email:req.body.email},{$push:{photo_publish: {url:req.body.url,data:req.body.data,email:req.body.email}}}) 
            }
          })
          res.send({s1:"success"})             
        });
    }); 
    app.post("/provideupdateaccess",async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11");
          collection.find({email:req.body.email,photo_publish:{$elemMatch:{url:req.body.url}}}).toArray(function(err, docs) {
            if(docs.length==1)
            {
            collection.updateOne({email:req.body.email,photo_publish:{$elemMatch:{url:req.body.url}}},{$set:{"photo_publish.$.data":req.body.data}}) 
            }
          })
          collection.updateOne({email:req.body.email,photo_publish_request:{$elemMatch:{url:req.body.url}}},{$set:{"photo_publish_request.$.superadmin_update_request":true}})
          
          res.send({s1:"success"})             
        });
    }); 
    app.post("/denyupdateaccess",async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11");
          collection.updateOne({email:req.body.email,photo_publish_request:{$elemMatch:{url:req.body.url}}},{$set:{"photo_publish_request.$.superadmin_update_request":false}})
          res.send({s1:"success"})             
        });
    }); 
    app.post("/deleteblog",async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11");
          collection.updateOne({email:req.body.email,photo_publish:{$elemMatch:{url:req.body.url}}},{$pull:{photo_publish:{url:req.body.url}}})
          res.send({s1:"success"})             
        });
    }); 
    app.post("/updateblogaccess",async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11");
          collection.updateOne({email:req.body.email,photo_publish_request:{$elemMatch:{url:req.body.url}}},{$set:{"photo_publish_request.$.superadmin_update_request":null,"photo_publish_request.$.data":req.body.data}})
          res.send({s1:"success"})             
        });
    }); 
    app.post("/denyblogaccess",async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11");
          collection.updateOne({email:req.body.email,photo_publish_request:{$elemMatch:{url:req.body.url}}},{$set:{"photo_publish_request.$.superadmin_grant_request":false}})
          res.send({s1:"success"})             
        });
    });  
    app.post("/finalupdateblogaccess",async (req, res) => { 
      client.connect(err => {
          const collection = client.db("abc").collection("abc11");
          collection.find({email:req.body.email,photo_publish:{$elemMatch:{url:req.body.url}}}).toArray(function(err, docs) {
            if(docs.length==1)
            {
            collection.updateOne({email:req.body.email,photo_publish:{$elemMatch:{url:req.body.url}}},{$set:{"photo_publish.$.data":req.body.data}}) 
            }
          })
          res.send({s1:"success"})             
        });
    }); 
app.post("/signin_account", async (req, res) => {
    client.connect(err => {
    const collection = client.db("abc").collection("abc11")
    collection.find({email:req.body.email,password:req.body.password}).toArray(function(err, docs) {
      res.send(docs)
    });
})      
  });
  
const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
