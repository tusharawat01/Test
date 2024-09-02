import User from "../models/userSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 15, haveDrones, notHavingDrones, haveWorkExp, haveLicense, phone, fullName, city, state } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    let query = {};

    if (haveDrones === 'true') {
      query['droneDetails'] = { $exists: true };
    }

    if (notHavingDrones === 'true') {
      query['droneDetails'] = null;
    }

    if (haveWorkExp === 'true') {
      query['workExp'] = { $exists: true };
    }

    if (haveLicense === 'true') {
      query['licenses.licenses'] = { $exists: true };
    }

    // if (email) query.email = { $regex: email, $options: 'i' };
    if (phone) query['phone.number'] = { $regex: phone, $options: 'i' };
    if (fullName) query.fullName = { $regex: fullName, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (state) query.state = { $regex: state, $options: 'i' };

    const users = await User.find(query)
      .select("-password")
      .populate('droneDetails')
      .populate('projects')
      .populate('licenses')
      .populate('workExp')
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit)
      .exec();

    const totalCount = await User.countDocuments(query);

    const stats = {
      totalUsersWithLicense: await User.countDocuments({ licenses: { $exists: true } }),
      numberOfPilots: await User.countDocuments({ role: 'Pilot' }),
      numberOfAppliedUsers: await User.countDocuments({ isApplied: true }),
      numberOfUsersWithDrones: await User.countDocuments({ droneDetails: { $exists: true } }),
      numberOfUsersWithWorkExp: await User.countDocuments({ workExp: { $exists: true } }),
    };

    res.json({
      page: parsedPage,
      limit: parsedLimit,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
      users,
      stats,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getUsersRegisteredToday = async (req, res) => {
  try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const users = await User.find({
          createdAt: { $gte: today }
      })   .select("-password")
      .populate('droneDetails')
      .populate('projects')
      .populate('licenses')
      .populate('workExp');
   
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
