const mongoose = require("mongoose");
const Boat = require("../models/Boat");
const Reading = require("../models/Readings")

exports.api_add_data = (req, res) => {
    const reading = new Reading({
      _id: new mongoose.Types.ObjectId(),
      boatId:req.body.boatId,
      temp: req.body.temp,
      turbidity: req.body.turbidity,
      tds:req.body.tds,
    });
    reading
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({ message: "Added Reading successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
}
exports.api_add_boat = (req, res) => {
        const boat = new Boat({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
        });
        boat
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({message: "Created boat successfully"})}).catch((err)=>{
        console.log(err);
      res.status(500).json({
        error: err,
      });
      })
};

exports.api_get_boats = (req, res) => {
    try{
    Boat.findAll({}, function (docs) {
      res.status(201).json(docs);
    })}
    catch(err){
        console.log(err)
        res.status(500).json({
          error: err,
        });
    }



}