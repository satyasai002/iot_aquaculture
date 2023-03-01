const mongoose = require("mongoose");
const Boat = require("../models/Boat");
const Reading = require("../models/Readings")

exports.api_add_data = async (req, res) => {
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const data =await Reading.findOne({boatId:req.boatId},
      { createdAt: { $gte: startOfToday } }
    );
    console.log(data)
    if(data){
      const ncount = +data.count+1;
      const ntemp = String(+data.temp + (+req.body.temp - +data.temp)/ncount);
      const nturbidity =
        String(+data.turbidity + (+req.body.turbidity - +data.turbidity) / ncount);
      const ntds = String(+data.tds + (+req.body.tds - +data.tds) / ncount);
      const nData = {
        temp: ntemp,
        turbidity: nturbidity,
        tds: ntds,
        count: ncount,
      };
      let doc = await Reading.findOneAndUpdate(
        { boatId: req.boatId },
        { createdAt: { $gte: startOfToday } },
        nData,
        {
          new: true,
        }
      );
      console.log(nData);
      res.status(201).json(doc);
    }
    else{
      const reading = new Reading({
        _id: new mongoose.Types.ObjectId(),
        boatId: req.body.boatId,
        temp: req.body.temp,
        turbidity: req.body.turbidity,
        tds: req.body.tds,
        count: 1,
      });
      await reading
        .save()
        .then((result) => {
          res.status(201).json({ message: "Added Reading successfully" });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
    
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