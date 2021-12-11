/*jshint esversion: 6 */
/*jshint esversion: 8 */
/*jshint esversion: 9 */

const Bootcamp = require("../models/bootcamp");
const ErrorResponse = require("../utilis/errorresponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utilis/geocoder");
const path = require("path");
const advancedResults = require("../middleware/advancedresults");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cd(
      null,
      file.fieldname + "--" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only images files are allowed"));
    }

    cb(new Error("File must be an image"));
    cd(undefined);
  },
});

//  Description: Get all BootCamps
// Access: Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//  Description: Get a single BootCamps
// Access: Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  res.status(200).json({ sucess: true, data: bootcamp });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the ID ${req.params.id}`, 404)
    );
  }
});

//  Description: Get a  BootCamps within a certain readius
// Access: Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius using radians
  //Divide distancs by radius ofthe earth
  // Earth Radius = 3,963miiles/ 6,378 km
  const radius = distance / 6378;
  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

//  Description: Create  BootCamps
// Access: Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  // Add User to request body
  req.body.user = req.user.id;

  //check for Published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // if the user is not an admin, they can only add one user
  if (publishedBootcamp && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already added a Bootcamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    sucess: true,
    data: bootcamp,
  });
});

//  Description: Update  BootCamps
// Access: Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the ID of ${req.params.id}`,
        404
      )
    );
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return new ErrorResponse(
      `User ${req.params.id} is not authorized to update this bootcamp`,
      404
    );
  }
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: bootcamp });
});

//  Description: Delete  BootCamps
// Access: Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the ID ${req.params.id}`, 404)
    );
  }
  bootcamp.delete();
  res.status(200).json({ sucess: true, data: "deleted" });
});

// Description File Upload using express file Upload
// Access: Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// Description: Upload a file using multer
// exports.uploadBootcampImage = asyncHandler(async (req, res, next) => {
//   console.log("hello");
// });
