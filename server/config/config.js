process.env.PORT = process.env.PORT || 3000;

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = "mongodb+srv://jjml:12345@cluster0.b0xxk.mongodb.net/handCloudBootcamp?retryWrites=true&w=majority";
} else{
    urlDB = "mongodb+srv://jjml:12345@cluster0.b0xxk.mongodb.net/handCloudBootcamp?retryWrites=true&w=majority";
}

process.env.SEED = process.env.SEED || 'Firma Secreta';

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '5m';

process.env.URLDB = urlDB;