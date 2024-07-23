const mongoose = require('mongoose');
// const { isModuleNamespaceObject } = require('util/types');
// const mongoURI = "mongodb://localhost:27017/inotebook"

// const connectToMongo = ()=>{
//     mongoose.connect(mongoURI, ()=>{
//         console.log("connected to mongo succesfully");
        
//     } )
// }

// module.exports = connectToMongo;

const server = '127.0.0.1:27017';
const database ='HelpingHande';

const connectToMongo = async () => {
    try{ 
        mongoose.set("strictQuery", false);
        await mongoose.connect(`mongodb+srv://shoaibsolanki73:B7yKSn2IHvqTQFRX@cluster0.hxvo9uz.mongodb.net/Heplinghands?retryWrites=true&w=majority`);
        // await mongoose.connect(`mongodb://${server}/${database}`);
        console.log("connected to mongo succesfully");
    } catch (err){
        console.log('Failled connected to mongodb', err);
    }
};

module.exports = connectToMongo; 