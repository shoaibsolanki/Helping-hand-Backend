const User = require("../models/User");
const Joi = require("joi");

class UpgradeLevelController {
  static async Upgradelevel(req, res) {
    try {
      // Validate the request body
      const schema = Joi.object({
        user_id: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { user_id } = req.body;

      // Find the user by user_id
      const user = await User.findOne({ user_id });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Increment the user's level
      if (user.level < 10) {
        try {
          const newLevel = (parseInt(user.level, 10) + 1).toString();
          user.level = newLevel;

          await user.save();
          console.log(`User ${user_id} level updated to ${newLevel}`);

          res.status(200).json({
            message: "User level upgraded successfully",
            user,
          });
        } catch (err) {
          console.error(`Error saving user ${user_id}:`, err);
          res.status(500).json({
            message: "Error upgrading user level",
            error: err.message,
          });
        }
      } else {
        res.status(400).json({
          message: "User level is already above 10",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while upgrading the user level",
      });
    }
  }
}

module.exports = UpgradeLevelController;
