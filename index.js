const mysql = require('mysql2')
const express = require('express');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'menu'
});

connection.connect(function(err){
    if(err){
        console.error('Erro: ',err)
        return
    }
    console.log("Conexão estabelecida com sucesso!")
});
/*
connection.query("INSERT INTO opcao(descircao,quantidade,valor,peso,medida,localizacao) VALUES (?,?,?,?,?,?)", function(err, result){
    if(!err){
        console.log("Dados inseridos com sucesso")
    } else{
        console.log("Erro. Não foi possivel inserir os dados ", err)
    }
});

connection.query("SELECT * FROM opcao ", function(err, rows, result){
    if(!err){
        console.log("resultados: ", rows)
    }else {
        console.log("Erro: Não foi possivel inserir os dados ",err)
    }
})*/
app.get("/estoque", function(req, res){
    res.sendFile(__dirname + "/estoque.html")
})

app.post('/adicionar',(req, res) =>{
    const descricao = req.body.descricao;
    const quantidade = req.body.quantidade;
    const valor = req.body.valor;
    const peso = req.body.peso;
    const medida = req.body.medida;
    const localizacao= req.body.localizacao;

    const values = [descricao,quantidade,valor,peso,medida,localizacao]
    const insert = "INSERT INTO opcao(descricao,quantidade,valor,peso,medida,localizacao) VALUES (?,?,?,?,?,?)"

    connection.query(insert, values, function(err, result){
        if(!err){
            console.log("Dados inseridos com sucesso!");
            res.send("Dados inseridos!");
        } else{
            console.log("Não foi possivel inserir os dados ", err);
            res.send("Erro!")
        }
    })
})
app.get("/listar", function(req, res){

    const selectAll = "SELECT * FROM opcao";

    connection.query(selectAll, function(err, rows){
        if(!err){
            console.log("Dados inseridos com sucesso!");
            res.send(`
            <html>
                    <head>
                        <title> cadastrar Itens </title>
                        <link rel="stylesheet" type="text/css"  href="/estilo.css" />
                    </head>
                    <body>
                        <h3>Listar Itens</h3>
                        <table>
                            <tr>
                                <th> descricao </th>
                                <th> quantidade </th>
                                <th> valor </th>
                                <th> peso </th>
                                <th> medida </th>
                                <th> localizacao </th>
                            </tr>
                            ${rows.map(row => `
                            <tr>
                                <td>${row.descricao}</td>
                                <td>${row.quantidade}</td>
                                <td>${row.valor}</td>
                                <td>${row.peso}</td>
                                <td>${row.medida}</td>
                                <td>${row.localizacao}</td>
                            </tr>
                            `).join('')}
                        </table>
                    </body>
            </html>  
        `);
      } else{
            console.log("Erro ao listar dados!", err);
            res.send("Erro!")
      }
    })
})


app.get("/",function(req,res){
    res.send(`
    <html>
    <head>
        <title> Sistema para Cadastro e Listagem de Estoque </title>
        <link rel="stylesheet" type="text/css"  href="/estilo.css" />
    </head>
    <body style="background-color:6959CD">
        <h2> Sistema para Cadastro e Listagem de Estoque </h2>
        <p><a href="http://localhost:8081/estoque"> Cadastrar Itens</a></p>
        <p><a href="http://localhost:8081/listar"> Listar Itens em Estoque</a></p>
    </body>
    </html>
    `)
})

app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081")
})