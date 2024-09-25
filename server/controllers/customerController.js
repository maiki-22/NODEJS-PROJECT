const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// GET home page
exports.homepage = async (req, res) => {
    const messages = await req.flash("info");
  
    const locals = {
      title: "Biblioteca",
      description: "MongoDB NodeJS",
    };
  
    let perPage = 11;
    let page = req.query.page || 1;
  
    try {
      const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await Customer.countDocuments({});
  
      res.render("index", {
        locals,
        customers,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
      });
    } catch (error) {
      console.log(error);
    }
  };
// exports.homepage = async (req,res) =>{


//         const messages = await req.flash("info");
    
//         const locals = {
//             title: 'Biblioteca',
//             description: 'CRUD MongoDB NodeJs'
//         }

//         try {
//             const customers = await Customer.find({}).limit(22);
//             res.render('index', {locals, messages, customers});
//         } catch (error) {
//             console.log(error);
//         }
    
// }

exports.addCustomer = async (req,res) =>{
    
    const locals = {
        title: 'Agregar Nuevo Libro',
        description: 'CRUD MongoDB NodeJs'
    }

    res.render('customer/add',locals);
 


}

// POST NUEVO LIBRO
exports.postCustomer = async (req, res) => {
    console.log(req.body);

    const newCustomer = new Customer({
        ISBN: req.body.ISBN,
        titulo: req.body.titulo,
        autor: req.body.autor,
        Ano_de_publicacion: req.body.Ano_de_publicacion,
        editorial: req.body.editorial,
        precio: req.body.precio
    });

    try {
        // Comprobar si ya existe un libro con el mismo ISBN
        const existingBook = await Customer.findOne({ ISBN: req.body.ISBN });
        if (existingBook) {
            // Enviar mensaje de error
            req.flash('error', 'El ISBN ya está registrado.');
            return res.redirect('/add');
        }

        // Crear el nuevo libro si el ISBN no está en uso
        await Customer.create(newCustomer);
        req.flash('success', 'Nuevo libro agregado.');
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error del servidor');
    }
};




// GET // editar libro 

exports.edit = async (req, res) => {
    try {
      const customer = await Customer.findOne({ _id: req.params.id });
  
      const locals = {
        title: "Editar Libro",
        description: "MONGODB NODEJS",
      };
  
      res.render("customer/edit", {
        locals,
        customer,
      });
    } catch (error) {
      console.log(error);
    }
  };

// GET // Actualizar libro 

exports.editPost = async (req, res) => {
    try {
      await Customer.findByIdAndUpdate(req.params.id, {
        ISBN: req.body.ISBN,
        titulo: req.body.titulo,
        autor: req.body.autor,
        Ano_de_publicacion: req.body.Ano_de_publicacion,
        editorial: req.body.editorial,
        precio: req.body.precio
      });
      await res.redirect(`/edit/${req.params.id}`);
  
      console.log("redirected");
    } catch (error) {
      console.log(error);
    }
  };


// ELIMINAR
exports.deleteCustomer = async (req, res) => {
    try {
      await Customer.deleteOne({ _id: req.params.id });
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };


  // BUSCAR


exports.searchCustomers = async (req, res) => {
    const locals = {
      title: "Search Books",
      description: "Sistema de búsqueda",
    };
  
    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      let query = {
        $or: []
      };
  
      query.$or.push(
        { titulo: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { autor: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { editorial: { $regex: new RegExp(searchNoSpecialChar, "i") } }
      );
  
      if (!isNaN(searchNoSpecialChar)) {
        const searchNumber = Number(searchNoSpecialChar);
  
        query.$or.push(
          { ISBN: searchNumber },
          { precio: searchNumber }
        );
  
        if (searchNumber >= 1000 && searchNumber <= 9999) {
          query.$or.push({
            Ano_de_publicacion: {
              $gte: new Date(searchNumber, 0, 1),
              $lte: new Date(searchNumber, 11, 31)
            }
          });
        }
      }
  
      const customers = await Customer.find(query);  // Aquí lo cambiamos a customers
  
      res.render("search", {
        customers,  // Aquí también lo enviamos como customers
        locals,
      });
    } catch (error) {
      console.log(error);
    }
  };