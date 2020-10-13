 const mongoose = require('mongoose');
 
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false,
    useUnifiedTopology: true
},(error,result)=>{
    if(error){
        return console.log(error);
    }
    console.log('DB Connected');
});
