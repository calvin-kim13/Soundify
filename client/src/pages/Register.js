import { useContext, useState } from "react"
import { AuthContext } from "../context/authContext"
import { useForm } from "../utils/hooks/hooks"
import { useMutation } from "@apollo/react-hooks"
import { message } from "antd"
import { IoIosArrowBack } from "react-icons/io"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

import { gql } from "graphql-tag"
import { Link, useNavigate } from "react-router-dom"

const REGISTER_USER = gql`
  mutation Mutation($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      email
      username
      token
    }
  }
`

function Register(props) {
  const context = useContext(AuthContext)
  let navigate = useNavigate()

  const [errors, setErrors] = useState([])
  const [showPassword, setShowPassword] = useState(false)

  function registerUserCallback() {
    const hide = message.loading("Creating account...", 0)
    setTimeout(hide, 1100)

    setTimeout(() => {
      registerUser()
    }, 1000)
  }

  const { onChange, onSubmit, values } = useForm(registerUserCallback, {
    username: "",
    email: "",
    password: "",
  })

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { registerUser: userData } }) {
      context.login(userData)
      navigate("/")
    },
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors)
    },
    variables: { registerInput: values },
  })

  const handleBackClick = () => {
    navigate("/")
  }

  return (
    <div className="sf-auth">
      <div className="sf-auth-card">
        <button
          type="button"
          className="sf-back"
          onClick={handleBackClick}
          aria-label="Back to home"
        >
          <IoIosArrowBack />
        </button>

        <div className="sf-auth-head">
          <div className="sf-wordmark">Soundify</div>
          <h1>Create your account</h1>
          <p>Sign up to start sharing your sound.</p>
        </div>

        <form
          className="sf-form"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(e)
          }}
        >
          <div className="sf-field">
            <input
              className="sf-input"
              placeholder="Username"
              name="username"
              onChange={onChange}
            />
          </div>

          <div className="sf-field">
            <input
              className="sf-input"
              placeholder="Email"
              name="email"
              type="email"
              onChange={onChange}
            />
          </div>

          <div className="sf-field sf-field-pw">
            <input
              className="sf-input"
              placeholder="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={onChange}
            />
            <button
              type="button"
              className="sf-eye"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          <p className="sf-hint">Must be at least 5 characters long.</p>

          <button className="sf-btn sf-btn-primary sf-btn-block" type="submit">
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="sf-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          {errors.map((error, index) => (
            <div className="sf-error" key={`${error}${index}`}>
              Something went wrong. Please try again.
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}

export default Register
