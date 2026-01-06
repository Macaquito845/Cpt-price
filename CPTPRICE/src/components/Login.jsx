import { useState } from 'react'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Para username, eliminar espacios automáticamente
    if (name === 'username') {
      const cleanedValue = value.replace(/\s/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setError('')
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }

  const validateUsername = (username) => {
    if (!username) return ''
    const trimmed = username.trim()
    
    if (trimmed.length < 4) {
      return 'El usuario debe tener al menos 4 caracteres'
    }
    if (trimmed.length > 15) {
      return 'El usuario no puede tener más de 15 caracteres'
    }
    
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!usernameRegex.test(trimmed)) {
      return 'Solo se permiten letras, números, guiones (-) y barra baja (_)'
    }
    
    return ''
  }

  const getUsernameMessage = () => {
    if (!formData.username) {
      return ''
    }
    
    const validationError = validateUsername(formData.username)
    if (validationError) {
      return validationError
    }
    
    // Si el campo es válido, no mostrar mensaje
    return ''
  }

  const shouldShowUsernameHelp = () => {
    // Solo mostrar si hay contenido en el campo
    if (!formData.username) {
      return false
    }
    
    // Mostrar si hay un error de validación
    if (validateUsername(formData.username)) {
      return true
    }
    
    // Mostrar mensaje de ayuda inicial mientras el usuario escribe (menos de 4 caracteres)
    if (formData.username.length > 0 && formData.username.length < 4) {
      return true
    }
    
    return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validación básica
    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError('Por favor completa todos los campos')
      setIsLoading(false)
      return
    }

    // Validación de username
    const username = formData.username.trim()
    if (username.length < 4 || username.length > 15) {
      setError('El usuario debe tener entre 4 y 15 caracteres')
      setIsLoading(false)
      return
    }
    
    // Validar que el username no tenga espacios (solo letras, números, guiones y barra baja)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!usernameRegex.test(username)) {
      setError('El usuario solo puede contener letras, números, guiones (-) y barra baja (_)')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        // Login exitoso
        alert(`¡Bienvenido ${result.user.username}!`)
        // Aquí puedes redirigir a la página principal
        console.log('User logged in:', result.user)
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Error de conexión. Por favor intenta nuevamente')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="glass-card">
        <div className="auth-header">
          <h1 className="auth-title">Captain Price</h1>
          <p className="auth-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              placeholder="Ingresa tu usuario"
              minLength={4}
              maxLength={15}
              pattern="[a-zA-Z0-9_-]+"
              required
            />
            {shouldShowUsernameHelp() && (
              <p className={`form-help-text ${validateUsername(formData.username) ? 'form-help-text-error' : ''}`}>
                {getUsernameMessage() || 'Entre 4 y 15 caracteres. Sin espacios. Puedes usar letras, números, guiones (-) y barra baja (_).'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
