var express = require('express');
var router = express.Router();
const Aeroporto = require('../db');
const axios = require('axios').default
const TOKEN = 'APPID=53266f36fe177350032dd42fa85edcb9'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* CREATE. */
router.get('/insere', function(req, res, next) {
  res.render('insere', { title: 'Express' });
});

router.post('/insere', async function(req, res, next) {
  const {aeroporto, cidade} = req.body
  
  try {
    //método para adicionar os valores ao mongodb
    const data = new Aeroporto({aeroporto, cidade})
    await data.save()
    res.redirect('lista')

  } catch (error) {
    res.render('error', {message: error, error});
  }

});


/* READ. */
router.get('/lista', async function(req, res, next) {

  try {
    //método para buscar objetos no mongodb
    const array = await Aeroporto.find()
    res.render('lista', { title: 'Express', array });
    
  } catch (error) {
    res.render('error', {message: error, error});
  }

});

router.get('/pesquisa', async function(req, res, next) {
  res.render('pesquisa', { title: 'Express'});
});

router.get('/resultpesquisa', async function(req, res, next) {
  const {aeroporto} = req.query

  try {

    const data = await Aeroporto.find({aeroporto})
    if(data.length == 1){
      // Método para remover acentos, pois o axios como utilizado não suporta
      const cidade = data[0].cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      const response = await axios.get("http://api.openweathermap.org/data/2.5/weather?q=" + cidade + `&${TOKEN}&lang=pt_br`)
      const temperatura = (response.data.main.temp - 273.15).toFixed(1)
      res.render('resultpesquisa', {title: 'pesquisa', aeroporto: data[0].aeroporto, cidade: data[0].cidade, temperatura})

    }else {
      res.render('resulterro', {title: 'ERRO'})
    }
    
  } catch (error) {
    res.render('error', {message: error, error});
  }

});



/* DELETE. */
router.get('/remove', async function(req, res, next) {
  const array = await Aeroporto.find()

  res.render('remove', { title: 'Express', array });
});

router.post('/remove', async function(req, res, next) {
  const {aeroporto, aeroporto1} = req.body

  // Método utilizado para garantir que caso a seleção e o input não tenham valor, nada seja feito
  const data = aeroporto ? aeroporto : aeroporto1 != '' ? aeroporto1 : res.redirect('lista')

  try {
    await Aeroporto.deleteOne({aeroporto: data})
    res.redirect('lista')
  } catch (error) {
    res.render('error', {message: error, error});
  }
});


module.exports = router;
