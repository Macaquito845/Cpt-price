import express from 'express'
import pool from '../config/database.js'
import bcrypt from 'bcrypt'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!password || (!username && !email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor completa todos los campos requeridos' 
      })
    }

    // Buscar usuario por username o email
    const query = `
      SELECT id, username, email, password 
      FROM usuarios 
      WHERE username = $1 OR email = $2
    `
    
    const result = await pool.query(query, [username || email, email || username])

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado. ¿Deseas registrarte?',
        suggestSignup: true
      })
    }

    const user = result.rows[0]

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta' 
      })
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión' 
    })
  }
})

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor completa todos los campos' 
      })
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor ingresa un correo electrónico válido' 
      })
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      })
    }

    // Verificar si el usuario o email ya existen
    const checkQuery = `
      SELECT id FROM usuarios WHERE username = $1 OR email = $2
    `
    const checkResult = await pool.query(checkQuery, [username, email])

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'El usuario o correo electrónico ya existe' 
      })
    }

    // Hash de la contraseña
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO usuarios (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email
    `
    const insertResult = await pool.query(insertQuery, [username, email, hashedPassword])

    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado exitosamente',
      user: insertResult.rows[0]
    })
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({ 
        success: false, 
        message: 'El usuario o correo electrónico ya existe' 
      })
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario' 
    })
  }
})

export default router
