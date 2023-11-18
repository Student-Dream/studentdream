const { error } = require("console");
const Donation = require("../Models/donationSchema");
const History = require("../Models/historySchema ");

exports.addDonation = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userID = req.user._id; 
   
    const newdonor = new Donation({
      request: requestId,
      user:userID
    });
    await newdonor.save();
    res
      .status(201)
      .json({ message: "New donation has been stored", donor: newdonor });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -----------------------------------------------------------------------------

exports.getDonation = async (req, res) => {
  try {
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

// -----------------------------------------------------------------------------

exports.deletedonation = async (req, res) => {
  try {
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


exports.acceptedonation = async (req, res) => {
  try {
    const donationId = req.params.id;
    const updatedRequestData = req.body;
    
    const userID = req.user._id; 
    updatedRequestData.status = 'Accepted';

    const donation = await Donation.findByIdAndUpdate(donationId, updatedRequestData, {
        user: userID
    });

    const updatedRequest = await donation.save();

    res.json(updatedRequest);
} catch (error) {
    res.status(500).json({ error: 'Failed to delete Request' });
}
};

exports.rejectdonation = async (req, res) => {
  try {
    const requestId = req.params.id;
    const updatedRequestData = req.body;
    
    const userID = req.user._id; 
    updatedRequestData.status = 'rejected';

    const donation = await Donation.findByIdAndUpdate(requestId, updatedRequestData, {
        user: userID
    });

    const updatedRequest = await donation.save();

    res.json(updatedRequest);
} catch (error) {
    res.status(500).json({ error: 'Failed to delete Request' });
}
};



