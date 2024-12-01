import express from 'express';
import cors from 'cors';

const app = express();


app.use(cors());
app.use(cors({
    origin: 'https://localhost:7221/api/*',
    methods: 'GET,POST', 
    credentials: true 
  }));

app.use(express());
app.use(express.static('static'));

app.get("/",function(req,res){res.sendFile(process.cwd()+"/static/index.html")})

app.listen(8081, function () {
    console.log("Servidor na porta 8081");
});