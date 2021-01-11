const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true});
        console.log(`DB connected:${conn.connection.host}`);
    }catch(err){
        console.log("error in connecting db",err);
        process.exit(1);
    }
}

module.exports=connectDB;