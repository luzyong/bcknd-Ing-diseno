const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3050;
const app = express();

app.use(bodyParser.json());

// MySql
const connection = mysql.createPool({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'bf65e0c286e91e',
  password: 'c5663d8b',
  database: 'heroku_94d3bf18c905e71'
});


 
  // Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

//REGISTROS
app.post('/registrausuario', (req, res) => {
  const sql = 'INSERT INTO clientes SET ?';
  const sql1 = 'INSERT INTO autos SET ?';

  const clienteObj = {
    CLCURP: req.body.curp,
    CLNombre: req.body.nombre,
    CLApellidos: req.body.apellidos,
    CLDireccion: req.body.direccion,
    CLTelefono: req.body.telefono,
    CLCorreo: req.body.email,
  };
  const autoObj = {
    AUNiv: req.body.niv,
    AUCURP: req.body.curp,
    AUMarca: req.body.marca,
    AUModelo: req.body.modelo,
    AUAnio: req.body.anio,
    AUPlaca: req.body.placa,
    AUColor: req.body.color
  };

  connection.query(sql, clienteObj, error => {
    if (error) throw error;
    connection.query(sql1,autoObj, error => {
      if (error) throw error;
      res.send('Cliente created!');
    });
  });
});

app.post('/registraauto', (req, res) => {
  const sql = 'INSERT INTO autos SET ?';

  const autoObj = {
    AUNiv: req.body.niv,
    AUCURP: req.body.curp,
    AUMarca: req.body.marca,
    AUModelo: req.body.modelo,
    AUAnio: req.body.anio,
    AUPlaca: req.body.placa,
    AUColor: req.body.color
  };

  connection.query(sql, autoObj, error => {
    if (error) throw error;
    res.send('auto created!');
  });
});

app.post('/registrareparacion', (req, res) => {
  const sql = 'INSERT INTO reparaciones SET ?';

  const reparacionObj = {
    RPReparacion: req.body.reparacion,
    RPNiv: req.body.niv,
    RPTipoArreglo: req.body.tipo,
    RPFechaInicio: req.body.fechainicio,
    RPFechaEntrega: req.body.fechaentrega,
    RPGarantia: req.body.garantia,
    RPCosto: req.body.costo
  };
  connection.query(sql, reparacionObj, error => {
    if (error) throw error;
    res.send('reparacion created!');
  });
});

app.post('/citamantenimiento', (req, res) => {
  const sql = 'INSERT INTO citas SET ?';

  const citaObj = {
    CTCitas: req.body.citas,
    CTNiv: req.body.niv,
    CTArreglo: req.body.arreglo,
    CTFecha: req.body.fecha,
    CTCosto: req.body.costo,
  };
  connection.query(sql, citaObj, error => {
    if (error) throw error;
    res.send('cita created!');
  });
});



// consultas
app.post('/consultahistorialgral', (req, res) => {
  const sql = 'SELECT * FROM reparaciones';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.post('/consultahistorial', (req, res) => {
  const reparacion = req.body.reparacion
  const sql = 'SELECT * FROM reparaciones WHERE RPReparacion = ?';

  connection.query(sql, reparacion, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.post('/consultacitas', (req, res) => {
  const fecha = req.body.fecha
  const sql = 'SELECT * FROM citas WHERE CTFecha = ?';

  connection.query(sql, fecha, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.post('/consultacliente', (req, res) => {
  const curp = req.body.curp;
  const sql = `SELECT * FROM clientes join autos on clientes.CLCURP = autos.AUCURP WHERE CLCURP = ?`;
  connection.query(sql, curp, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('Not result');
    }
  });
});

//Modificaciones
app.post('/actualizacliente', (req, res) => {
  const id = JSON.stringify(req.body.curp);
  const sql = `UPDATE clientes SET ? WHERE CLCURP =${id}`;

  const upclienteObj = {
    CLCURP: req.body.curp,
    CLNombre: req.body.nombre,
    CLApellidos: req.body.apellidos,
    CLDireccion: req.body.direccion,
    CLTelefono: req.body.telefono,
    CLCorreo: req.body.email
  };

  connection.query(sql,upclienteObj, error => {
    if (error) throw error;
    res.send('Cliente actualizado');
  });
});

app.post('/actualizaauto', (req, res) => {
  const id = JSON.stringify(req.body.curp);
  const sql = `UPDATE autos SET ? WHERE AUCURP =${id}`;

  const autoObj = {
    AUNiv: req.body.niv,
    AUCURP: req.body.curp,
    AUMarca: req.body.marca,
    AUModelo: req.body.modelo,
    AUAnio: req.body.anio,
    AUPlaca: req.body.placa,
    AUColor: req.body.color
  };

  connection.query(sql, autoObj, error => {
    if (error) throw error;
    res.send('auto actualizado!');
  });
});

app.post('/eliminarcliente', (req, res) => {
  const id = req.body.curp;
  const sql = 'DELETE FROM clientes WHERE CLCURP= ?';
  const sql1 = 'DELETE FROM autos WHERE AUCURP= ?';
  connection.query(sql1, id, error => {
    if (error) throw error;
    connection.query(sql, id, error => {
      if (error) throw error;
      res.send('Cliente eliminado');
    });
  });
  
});

app.post('/eliminarauto', (req, res) => {
  const id = req.body.niv;
  const sql = 'DELETE FROM autos WHERE AUNiv= ?';
  connection.query(sql,id, error => {
    if (error) throw error;
    res.send('Auto eliminado');
  });
});
  






// Check connect
/*connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});*/


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
