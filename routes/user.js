const router = require("express").Router()
const cloudinary = require("../utils/cloudinary")
const upload = require("../utils/multer")
const Post = require('../model/user')
const SibApiV3Sdk = require('sib-api-v3-sdk')
require("dotenv").config()
// route to backend page
var path = require('path');
router.get("/admin", async (req, res) => {
  try {
      res.sendFile(path.join(__dirname, "index.html"))
        
    } catch (err) {
        console.log(err)
    }     
})


// get email from frontend
router.post('/sendinblue', async(req, res) => {
    const email = req.body.Email

    res.send('success')
    let apikey = process.env.SIB_API_KEY

    // // auth + setup
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = apikey;

    // create contact
    var apiInstance = new SibApiV3Sdk.ContactsApi();
    let createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = email
    createContact.listIds = [2]

    // // call SIB api
    await apiInstance.createContact(createContact).then((data) => {
      console.log('Email added successfully');
      }).catch(error => console.log("something's wrong but your email was sent"))


    // send confirmation email
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let templateId = 5; 

    let sendTestEmail = new SibApiV3Sdk.SendTestEmail(); 

    sendTestEmail.emailTo = [email];

    apiInstance.sendTestTemplate(templateId, sendTestEmail).then(function() {
      console.log('Welcome mail sent.');
    }, function(error) {
      console.error(error);
    });
})



// post request
router.post('/', upload.single('image'), async(req, res) => {
    try {
        // uploading image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path)
        // const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        // console.log(date)
        
        // Create new user
        let user = new Post({
            title: req.body.title,
            author_name: req.body.author_name,
            article: req.body.article,
            post_date: req.body.post_date,
            // post_date: date,
            post_length: req.body.post_length,
            imageURL: result.secure_url,
            cloudinary_id: result.public_id,
        })

        // Save user
        await user.save()
        res.json(user)

    } catch(err) {
        console.log(err)
    }
})




router.get("/", async (req, res) => {
  try {
    let user = await Post.find()
    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

router.get("/featured", async (req, res) => {
  try {
    let user = await Post.find()
    let feature = user[0]
    res.json(feature)
    console.log(feature)
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id", async(req, res) => {
    try {
        let user = await Post.findById(req.params.id)
        res.json(user)
        
    } catch (err) {
        console.log(err)
    }     
})

router.delete("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await Post.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Delete user from db
    await user.remove()
    res.json(user)

  } catch (err) {
    console.log(err)
  }
})




router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let user = await Post.findById(req.params.id)
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id)
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path)
    }
    const data = {
      title: req.body.title || user.title,
      author_name: req.body.author_name || user.author_name,
      article: req.body.article || user.article,
      post_date: req.body.post_date || user.post_date,
      post_length: req.body.post_length || user.post_length,
      imageURL: result?.secure_url || user.imageURL,
      cloudinary_id: result?.public_id || user.cloudinary_id,
    };
    user = await Post.findByIdAndUpdate(req.params.id, data, { new: true })
    res.json(user)

  } catch (err) {
    console.log(err)
  }
})


module.exports = router