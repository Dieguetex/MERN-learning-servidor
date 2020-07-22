const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
const Tarea = require("../models/Tarea");

exports.crearProyecto = async (req, res) => {
  // Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errores: errors.array(),
    });
  }

  try {
    // Crear un nuevo proyecto
    const proyecto = new Proyecto(req.body);

    // Guardar el creado vía JWT
    proyecto.creador = req.usuario.id;

    // Guardamos el proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);

    res.status(500).send("Hubo un error");
  }
};

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({
      creador: req.usuario.id,
    }).sort({ creado: -1 });

    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
  // Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errores: errors.array(),
    });
  }

  // Extraer la información del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    // Revisar el id
    let proyecto = await Proyecto.findById(req.params.id);

    // Si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Actualizar
    proyecto = await Proyecto.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);

    res.status(500).send("Error en el servidor");
  }
};

// Elimina un proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    // Revisar el id
    let proyecto = await Proyecto.findById(req.params.id);

    // Si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    await Tarea.deleteMany({ proyecto: req.params.id });

    // Eliminar proyecto
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
