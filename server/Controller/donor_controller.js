const { error } = require("console");
const Donation = require("../Models/donationSchema");
const History = require("../Models/historySchema ");
const Request = require("../Models/requestSchema");
const User = require("../Models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 


exports.addDonation = async (req, res) => {
  try {
    const requestId = req.params.id;
    const formData = req.body;

    if (!formData.fund) {
      return res.status(400).json({ error: "Missing 'fund' in request body" });
    }

    const newDonation = new Donation({
      request: requestId,
      fund: formData.fund
    });

    await newDonation.save();

    // Redirect if needed
    // res.redirect('http://localhost:5000/');

    // Send a success response
    res.status(201).json({ message: "New donation has been stored", donation: newDonation });
  } catch (error) {
    console.error("Error adding donation:", error);

   
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.createCheckoutSession = async (req, res) => {
  try {
    const donorID = req.params.id;
    const donation = await Donation.findById(donorID);

  
    const requestDocument = await Request.findById(donation.request);

    if (!requestDocument) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const unitAmount = Math.round(parseFloat(donation.fund) * 100);
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: String(requestDocument.title), 
        },
        unit_amount: unitAmount,
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    
    await postHistory(req, res);
    res.json({ id: session.id });
    
     await Request.checkconfirm(donation.userId);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Payment failed' });
  }
};

// -----------------------------------------------------------------------------

exports.getDonation = async (req, res) => {
  try {
    // if (req.user.role !== 'donor') {
    //   return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    // }
    const alldonation = await Donation.find({ is_deleted: false });
    res.json(alldonation);
  } catch (error) {
    console.error("Error finding database:", error);
    res.json({ message: "Error" });
  }
};

// -----------------------------------------------------------------------------

exports.getHistory = async (req, res) => {
  try {
    // if (req.user.role !== 'donor') {
    //   return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    // }
    const history = await History.find();
    res.json(history);
  } catch (error) {
    console.error("Error finding database:", error);
    res.json({ message: "Error" });
  }
};

// -----------------------------------------------------------------------------

exports.postHistory = async (req, res) => {
  try {
    const dontaionID = req.params.id
    const newhistory = new History({
      donation:dontaionID,
    });

    await newhistory.save();
    res
      .status(201)
      .json({ message: "New history has been stored", donor: newhistory });
  } catch (error) {
    console.error("Error adding to history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// -----------------------------------------------------------------------------

exports.countDonations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    }
    const donationCount = await Donation.countDocuments();
    res.json({ count: donationCount });
  } catch (error) {
    console.error("Error counting donations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -----------------------------------------------------------------------------

exports.donorFrequency = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    }
    const donorFrequency = await Donation.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({ donorFrequency });
  } catch (error) {
    console.error("Error getting donor frequency:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.unFrequency = async (req, res) => {
  try {
    const unFrequency = await Donation.aggregate([
      {
        $group: {
          _id: "$university_name",  
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({ unFrequency });
  } catch (error) {
    console.error("Error getting univeristy donation frequency:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// -----------------------------------------------------------------------------

exports.deletedonation = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ success: false, error: 'User is not authorized to view requests' });
    }
    const id = req.params.id;
    const deleteddonation = await Donation.findByIdAndUpdate(id, {
      is_deleted: true,
    });
    if (deleteddonation) {
      res.json({ message: `Donation deleted successfully`, deleteddonation });
    } else {
      res.json({ message: `Donation not found` });
    }
  } catch (error) {
    console.error(`Error deleting donation`, error);
    res.json({ message: `Error deleting donation` });
  }
};

// ---------------------------------------------------------------------------------------

// exports.updatedonation = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { status } = req.body;
//     const updateddonation = await Donation.findByIdAndUpdate(
//       id,
//       { status },
//       {
//         new: true,
//       }
//     );
//     if (updateddonation) {
//       res.json({ message: "Donation updated successfully", updateddonation });
//     } else {
//       res.json({ message: "Donation not found" });
//     }
//   } catch (error) {
//     console.error("Error updating Donation", error);
//     res.json({ message: "Error updating Donation" });
//   }
// };





