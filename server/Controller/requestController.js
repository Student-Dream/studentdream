const Request = require('../Models/requestSchema');
const multer = require("multer");
const path = require('path');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../client/assets/uploads'),
  filename: function (req, file, cb) {
    cb(null, 'file-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Please upload a valid PDF file'));
    }
    cb(null, true);
  }
}).single('file');

const newrequest = async (req, res) => {
  
  try {

    // if (req.user.role !== 'student') {
    //   return res.status(403).json({ success: false, error: 'User is not authorized to create a request' });
    // }

    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      const userID = req.user._id;
      const formData = req.body;
      const file = req.file ? req.file.filename : null;

      const newRequest = new Request({
        title: formData.title,
        description: formData.description,
        university_id: formData.university_id,
        university_name: formData.university_name,
        fund: formData.fund,
        user: userID,
        student_proof: file,
      });

      const request = await newRequest.save();
      res.json(request);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create a new request' });
  }
};

const myRequests = (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
  }

  const userID = req.user._id;
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 

  const skip = (page - 1) * limit;

  Request.find({ is_deleted: false, user: userID })
    .skip(skip)
    .limit(limit)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};



const allRequests = (req, res) => {
 
  Request.find({ is_deleted: false })
      .then((data) => {
        res.render("donor", {
          requests: data,
          user: req.user,
          username: req.user.username,
          $lookup:
          {
             from: "User",
             localField: "userid",
             foreignField: "user",
             as: "inventoryDocs"
          }
        });
      })    
    
      .catch((error) => {
          errorHandler(error, req, res);
      });
};


// const allrejected= (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
//   }
//   Request.find({ is_deleted: false ,status:"rejected"})
//       .then((data) => {
//         res.render("donor", {
//           requests: data,
//           user: req.user,
//           username: req.user.username,
//         });
//       })
//       .catch((error) => {
//           errorHandler(error, req, res);
//       });
// };


const allaccepted = (req, res) => {

  Request.find({ is_deleted: false ,status:"accepted"})
      .then((data) => {
        res.render("donor", {
          requests: data,
          // user: req.user,
          // $lookup:
          // {
          //    from: "User",
          //    localField: "userid",
          //    foreignField: "user",
          //    as: "inventoryDocs"
          // }
        });
      })
      .catch((error) => {
          console.log(error);
      });
};


const createCheckoutSession = async (req, res) => {
  try {
    const requestId = req.params.requestId; 
    const request = await Request.findById(requestId);

    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: request.title,
        },
        unit_amount: Math.round(request.fund * 100),
      },
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
    await Request.checkconfirm(request.userId); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Payment failed' });
  }
};



const pendingRequests = (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
  }
  const userID = req.user._id; 
  Request.find({ is_deleted: false,user:userID,status:"pending"})
      .then((data) => {
          res.json(data);
      })
      .catch((error) => {
          errorHandler(error, req, res);
      });
};


const myacceptedRequests = (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
  }
  const userID = req.user._id; 
  Request.find({ is_deleted: false,user:userID,status:"accepted"})
      .then((data) => {
          res.json(data);
      })
      .catch((error) => {
          errorHandler(error, req, res);
      });
};

const myrejectedRequests = (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
  }
  const userID = req.user._id; 
  Request.find({ is_deleted: false,user:userID,status:"rejected"})
      .then((data) => {
          res.json(data);
      })
      .catch((error) => {
          errorHandler(error, req, res);
      });
};



const updateRequest = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    }
      const requestId = req.params.id;
      const updatedRequestData = req.body;
     const userID = req.user._id; 
     const request = await Request.findByIdAndUpdate(
      requestId,
      { ...updatedRequestData, user: userID, status: 'pending', is_deleted: false },
      { new: true } 
    );
      
      
      if (!request) {
          return res.status(404).json({ error: 'Request not found' });
      }
      const updatedRequest = await request.save();


      res.json(updatedRequest);
  } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const accept = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    }
    const requestId = req.params.id;
    const updatedRequestData = req.body;
    
    const userID = req.user._id; 
    updatedRequestData.status = 'accepted';

    const request = await Request.findByIdAndUpdate(requestId, updatedRequestData, {
        user: userID
    });

    const updatedRequest = await request.save();

    res.json(updatedRequest);
} catch (error) {
    res.status(500).json({ error: 'Failed to delete Request' });
}
};

const reject = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    }
    const requestId = req.params.id;
    const updatedRequestData = req.body;
    
    const userID = req.user._id; 
    updatedRequestData.status = 'rejected';

    const request = await Request.findByIdAndUpdate(requestId, updatedRequestData, {
        user: userID
    });

    const updatedRequest = await request.save();

    res.json(updatedRequest);
} catch (error) {
    res.status(500).json({ error: 'Failed to delete Request' });
}
};

const complete = async (req, res) => {
  try {

    const requestId = req.params.id;
    const updatedRequestData = req.body;
    
    const userID = req.user._id; 
    updatedRequestData.status = 'completed';

    const request = await Request.findByIdAndUpdate(requestId, updatedRequestData, {
        user: userID
    });

    const updatedRequest = await request.save();

    res.json(updatedRequest);
} catch (error) {
    res.status(500).json({ error: 'Failed to delete Request' });
}
};


const deleteRequest= async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    }
      const requestId = req.params.id;
      const updatedRequestData = req.body;
      
      const userID = req.user._id; 
      updatedRequestData.is_deleted = true;

      const request = await Request.findByIdAndUpdate(requestId, updatedRequestData, {
          user: userID
      });

      const updatedRequest = await request.save();

      res.json(updatedRequest);
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete Request' });
  }
};





module.exports = {
  newrequest,
  myRequests,
  pendingRequests,
  myacceptedRequests,
  myrejectedRequests,
  updateRequest,
  deleteRequest,
  reject,
  accept,
  allaccepted,
  allRequests,
  createCheckoutSession
};