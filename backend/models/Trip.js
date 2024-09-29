// models/Trip.js
import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  VendorID: { type: Number },
  lpep_pickup_datetime: { type: Date },
  lpep_dropoff_datetime: { type: Date },
  store_and_fwd_flag: { type: String },
  RatecodeID: { type: Number },
  PULocationID: { type: Number },
  DOLocationID: { type: Number },
  passenger_count: { type: Number },
  trip_distance: { type: Number },
  fare_amount: { type: Number },
  extra: { type: Number },
  mta_tax: { type: Number },
  tip_amount: { type: Number },
  tolls_amount: { type: Number },
  ehail_fee: { type: Number, default: null },
  improvement_surcharge: { type: Number },
  total_amount: { type: Number },
  payment_type: { type: Number },
  trip_type: { type: Number },
  congestion_surcharge: { type: Number },
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;
