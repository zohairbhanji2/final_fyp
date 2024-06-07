const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const User = require('./models/user');
const Feedback = require('./models/Feedback');
const RegisterDoctor = require('./models/DoctorRegistration');
const Shopkeeper = require('./models/shopkeeper');
const mongoose = require('mongoose');
const prescription = require('./models/prescription');
const WebSocket = require('ws');
const Question = require('./models/question');
const http = require('http');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mapAccessToken = process.env.REACT_APP_MAP_ACCESS_TOKEN;
const keysecret = process.env.SECRET_KEY;


const port = process.env.PORT || 5000;
const app = express();


mongoose.connect('mongodb+srv://zohairbhanji:admin123@emedoc.6o1kprk.mongodb.net/?retryWrites=true&w=majority', { });
//  useNewUrlParser: true, useUnifiedTopology: true



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const medicineSchema =  new mongoose.Schema({
  Name: String,
  Category: String,
  GenericName: String,
  Manufacturer: String,
  SalePrice: Number,
});

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"ritickkumar2224@gmail.com",
    pass:"dmknokefejrpuuha"
  }
});



const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

const clients = {};

wss.on('connection', (ws, request) => {
  const urlParams = new URLSearchParams(request.url.split('?')[1]);
  const userEmail = urlParams.get('user');

  if (userEmail) {
    clients[userEmail] = ws;
    console.log(`Connected: ${userEmail}`);

    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message);
      const { shopName, question, response, email } = parsedMessage;

      if (response && email) {
        // This is a response from a shopkeeper to a user
        if (clients[email]) {
          clients[email].send(JSON.stringify({ email, response }));
          console.log(`Response sent to ${email}: ${response}`);
        } else {
          console.log(`User ${email} not connected`);
        }
        return;
      }

      if (!shopName || !question) {
        ws.send(JSON.stringify({ error: 'Shop name or question is missing in the message' }));
        return;
      }

      try {
        const shopkeeper = await Shopkeeper.findOne({ shopname: shopName });

        if (!shopkeeper) {
          ws.send(JSON.stringify({ error: `No shopkeeper found with shop name: ${shopName}` }));
          return;
        }

        const shopkeeperEmail = shopkeeper.email;

        const newQuestion = new Question({
          userEmail,
          shopEmail: shopkeeperEmail,
          question: question,
        });
        await newQuestion.save();

        if (clients[shopkeeperEmail]) {
          clients[shopkeeperEmail].send(JSON.stringify({
            from: userEmail,
            question: question,
          }));
          console.log(`Message sent to ${shopName}: ${question}`);
        } else {
          console.log(`Client ${shopkeeperEmail} not connected`);
        }
      } catch (error) {
        ws.send(JSON.stringify({ error: `Error fetching shopkeeper email: ${error.message}` }));
      }
    });

    ws.on('close', () => {
      delete clients[userEmail];
      console.log(`Disconnected: ${userEmail}`);
    });
  } else {
    console.log('Connection attempted without a userEmail');
  }
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(5001, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:5001`);
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });



app.post('/api/register', async (req, res) => {
  try {
    const { email, password, cnic, type, licensenumber, username, shopname, shoplocation } = req.body;

    if (type === 'user') {
      const user = new User({ email, username, password, cnic });
      await user.save();
      res.status(200).json({ message: 'User registered successfully' });
    } else if (type === 'doctor') {
      const registerDoctor = new RegisterDoctor({ email, username, password, licensenumber, cnic });
      await registerDoctor.save();
      res.status(200).json({ message: 'Doctor registered successfully' });
    } else if (type === 'shopkeeper') {
      const newShopkeeper = new Shopkeeper({ email, username, password, cnic, shopname, shoplocation });
      await newShopkeeper.save();
      res.status(200).json({ message: 'Shopkeeper registered successfully' });
    } else {
      res.status(400).json({ error: 'Invalid registration type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the user, doctor, or shopkeeper' });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const registerDoctor = await RegisterDoctor.findOne({ email });
    const newShopkeeper = await Shopkeeper.findOne({ email }); // Change here

    if (!user && !registerDoctor && !newShopkeeper) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user) {
      const isUserPasswordValid = await bcrypt.compare(password, user.password);
      if (!isUserPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      return res.status(200).json({ message: 'Login successful', type: 'user' });
    }

    if (registerDoctor) {
      const isDoctorPasswordValid = await bcrypt.compare(password, registerDoctor.password);
      if (!isDoctorPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      return res.status(200).json({ message: 'Login successful', type: 'doctor' });
    }

    if (newShopkeeper) {
      const isShopkeeperPasswordValid = await bcrypt.compare(password, newShopkeeper.password);
      if (!isShopkeeperPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      return res.status(200).json({ message: 'Login successful', type: 'shopkeeper' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred while processing the login request' });
  }
});

app.get('/api/shopkeeper/info/:email', async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Fetch shopkeeper information from the database based on the provided email
    const shopkeeper = await Shopkeeper.findOne({ email });

    // If no shopkeeper found, return 404 error
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    // Return the shopkeeper information
    return res.status(200).json({ shopkeeper });
  } catch (error) {
    console.error('Error fetching shopkeeper info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/shopkeepers', async (req, res) => {
  try {
    // Fetch all shopkeepers from the database
    const shopkeepers = await Shopkeeper.find();

    // If no shopkeepers found, return 404 error
    if (!shopkeepers || shopkeepers.length === 0) {
      return res.status(404).json({ error: 'No shopkeepers found' });
    }

    // Return the list of shopkeepers
    return res.status(200).json({ shopkeepers });
  } catch (error) {
    console.error('Error fetching shopkeepers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/feedback', async (req, res) => {
  const { Name, Email, MobileNo, Comment } = req.body;
  try {
    const newFeedback = new Feedback({
      Name,
      Email,
      MobileNo,
      Comment
    });
    await newFeedback.save();
    console.log('New Feedback saved:', newFeedback);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET endpoint to retrieve feedback data
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbackData = await Feedback.find();
    res.status(200).json(feedbackData);
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/questions/respond', async (req, res) => {
  const { userEmail, response } = req.body;
  try {
    const question = await Question.findOneAndUpdate(
      { userEmail, answered: false },
      { response, answered: true },
      { new: true }
    );
    res.json({ message: 'Response sent successfully', question });
  } catch (error) {
    console.error('Error sending response:', error);
    res.status(500).json({ error: 'Failed to send response' });
  }
});

app.get('/api/questions', async (req, res) => {
  const shopEmail = req.query.shopEmail;
  try {
    const questions = await Question.find({ shopEmail, answered: false });
    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});



app.post("/api/sendpasswordlink", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ status: 401, message: "Enter your Email" });
    }
    const userfind = await User.findOne({ email });
    if (!userfind) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    const keysecret = "yourSecretKeyHere"; 
    const token = jwt.sign({ _id: userfind._id },
       keysecret, { expiresIn: "1d" });


    const updatedUser = await User.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
    );
    if(updatedUser){
      const mailOptions = {
        from: "ritickkumar2224@gmail.com",
        to: email,
        subject: "Sending Email for reset your Password",
        text: `This link is valid for 2 minutes http://192.168.0.105:5173/resetpassword/${userfind.id}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(401).json({ status: 401, message: "Email not Sent" });
        } else {
          console.log("Email sent:", info.response);
          res.status(201).json({ status: 201, message: "Email sent Successfully." });
        }
      });
    }  
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});



app.post("/api/resetpassword/:id", async(req, res)=>{
  const {id } = req.params;
  const token = req.headers['x-auth-token']; 
  
  try {
    const validuser = await User.findOne({_id:id,verifytoken:token})
    const newverifyToken = jwt.verify(token,keysecret)
    if(validuser && newverifyToken._id){
      const {password} = req.body
      const newEncryptedPassword = await bcrypt.hash(password, 12);
      const setNewUserPass = await User.findByIdAndUpdate({ _id: id }, { password: newEncryptedPassword });

      res.status(201).json({ status: 201, message: 'Password updated successfully' });
    }else{
      res.status(401).json({status:401,message:"Invalid user or token"});
    }
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({status:500,message:"error"});    
  }
});


app.get("/api/forgotpassword/:id", async(req,res)=>{
const {id } = req.params;
const token = req.headers['x-auth-token'];
try {
  const validuser = await User.findOne({_id:id,verifytoken:token})
  if (validuser) {
    const {password} = req.body;
    const newpassword = await bcrypt.hash(password,12)
    const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:newpassword});
    setnewuserpass.save();
    res.status(201).json({ status: 201, message: 'User is valid' });
  } else {
    res.status(401).json({ status: 401, message: 'Invalid user or token' });
  }
} catch (error) {
  console.error('Error validating user:', error);
  res.status(500).json({ status: 500, message: 'Internal Server Error' });
}
});


app.get('/api/register', async (req, res) => {
  try {
    const registrationInfo = await User.find({}, 'email');
    res.status(200).json(registrationInfo);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching registration information' });
  }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

app.get('/api/searchMedicine/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm.toLowerCase();
    const medicines = await Medicine.find({ Name: { $regex: searchTerm, $options: 'i' } });

    if (!medicines || medicines.length === 0) {
      console.log('Medicines not found');
      res.json({ message: 'Medicines not found' });
      return;
    }

    console.log('Medicines found:', medicines);
    res.json({ medicines });
  } catch (error) {
    console.error('Error searching for medicines:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/findSimilarMedicines/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm.toLowerCase();
    const medicine = await Medicine.findOne({ Name: { $regex: searchTerm, $options: 'i' } });

    if (!medicine) {
      console.log('Medicine not found');
      res.json({ message: 'Medicine not found' });
      return;
    }

    console.log('Medicine found:', medicine);

    const searchGenericName = medicine.GenericName.toLowerCase();
    const similarMedicines = await Medicine.find({ GenericName: { $regex: searchGenericName, $options: 'i' } });

    if (similarMedicines.length === 0) {
      console.log('No similar medicines found');
      res.json({ message: 'No similar medicines found' });
      return;
    }

    console.log('Similar medicines found:', similarMedicines);
    res.json({ similarMedicines });
  } catch (error) {
    console.error('Error finding similar medicines:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Change password route
app.post('/api/changepassword', async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Save new password directly without encryption
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



// Change password route for Doctor
app.post('/api/DRchangepassword', async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const doctor = await RegisterDoctor.findOne({ email });

    // If user not found
    if (!doctor) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Save new password directly without encryption
    doctor.password = newPassword;
    await doctor.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



// Change password route for shopkeeper
app.post('/api/SHchangepassword', async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const shopown = await Shopkeeper.findOne({ email });

    // If user not found
    if (!shopown) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, shopown.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Save new password directly without encryption
    shopown.password = newPassword;
    await shopown.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



// Endpoint to get user profile by email
app.get('/api/user/profile', async (req, res) => {
  try {
    const userEmail = req.query.email; // Retrieve user's email from query parameters
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.username,
      email: user.email,
      cnic: user.cnic,
      Phonenumber: user.Phonenumber,
      // Add more fields as needed
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint to get doctor profile by email
app.get('/api/doctor/profile', async (req, res) => {
  try {
    const doctorEmail = req.query.email; // Retrieve doctor's email from query parameters
    const doctor = await RegisterDoctor.findOne({ email: doctorEmail });
    if (!doctor) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: doctor.username,
      email: doctor.email,
      licensenumber: doctor.licensenumber,
      cnic: doctor.cnic,
      Phonenumber: doctor.Phonenumber,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint to get user profile by email
app.get('/api/shp/profile', async (req, res) => {
  try {
    const shpEmail = req.query.email; // Retrieve user's email from query parameters
    if (!shpEmail) {
      return res.status(400).json({ message: 'Email not found' });
    }
    const shopdts = await Shopkeeper.findOne({ email: shpEmail });
    if (!shopdts) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: shopdts.username,
      email: shopdts.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});





app.post('/api/sendPrescription',  async (req, res) => {
  try {
    const { medicine, dosage, Date, email } = req.body;
    

    if (!medicine || !dosage || !Date || !email) {
      return res.status(400).send('All fields are required for a prescription.');
    }

    const newPrescription = new prescription({ medicine, dosage, Date, email });
    await newPrescription.save();
    res.status(200).send('Prescription sent successfully');
  } catch (error) {
    console.error('Error sending prescription:', error);
    res.status(500).send('Failed to send prescription. Please try again.');
  }
});


app.get('/api/getPrescriptions/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log('Email:', email);

    const prescriptions = await prescription.find({ email });
    console.log('Prescriptions:', prescriptions);

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

app.listen(port, "192.168.0.105", () => {
  console.log(`Server is running on http://192.168.0.105:${port}`);
});
