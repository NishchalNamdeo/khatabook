const hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/user-models")


module.exports.hisaabPageController = async function (req, res) {
    res.render("create")
}
module.exports.createHisaabController = async function (req, res) {
    let { title, description, encrypted, shareable, passcode, editpermission } = req.body;

    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editpermission = editpermission === "on" ? true : false;

    try {
        let hisaab = await hisaabModel.create({
            title,
            description,
            user: req.user._id,
            passcode,
            encrypted,
            shareable,
            editpermission,
        });

        let user = await userModel.findOne({ email: req.user.email });
        user.hisaab.push(hisaab._id);
        await user.save();
        res.redirect("/profile")
     

    } catch (err) {
        res.send(err.message)
    }

}


