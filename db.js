var mongoose = require('mongoose');
mongoose.connect(
    "mongodb://localhost:27017/prova",
    () => {
      console.log("mongodb conectado");
    }
);

const AeroSchema = mongoose.Schema(
    {
      aeroporto: {
        type: String,
        required: true,
      },
      cidade: {
        type: String,
        required: true,
      }
    },
    { collection: "aerocollection" }
);

module.exports = mongoose.model("Aeroporto", AeroSchema);