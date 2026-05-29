import { useContext, useState } from "react"
import { AuthContext } from "../context/authContext"
import { useForm } from "../utils/hooks/hooks"
import { useMutation } from "@apollo/react-hooks"
import { message } from "antd"
import { IoIosArrowBack } from "react-icons/io"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

import { gql } from "graphql-tag"
import { Link, useNavigate } from "react-router-dom"

const LOGIN_USER = gql`
    mutation login($loginInput: LoginInput) {
        loginUser(loginInput: $loginInput) {
            email
            username
            token
        }
    }
`

function Login(props) {
    let navigate = useNavigate()

    const myContext = useContext(AuthContext)
    const [errors, setErrors] = useState([])
    const [showPassword, setShowPassword] = useState(false)

    function loginUserCallback() {
        const hide = message.loading("Logging in...", 0)
        setTimeout(hide, 1100)

        setTimeout(() => {
            loginUser()
        }, 1000)
    }

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        email: "",
        password: "",
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, { data: { loginUser: userData } }) {
            myContext.login(userData)
            navigate("/")
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors)
        },
        variables: { loginInput: values },
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
                    <h1>Welcome back</h1>
                    <p>Log in to keep listening.</p>
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
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible />
                            ) : (
                                <AiOutlineEye />
                            )}
                        </button>
                    </div>

                    <button
                        className="sf-btn sf-btn-primary sf-btn-block"
                        type="submit"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>

                    <p className="sf-switch">
                        Don't have an account?{" "}
                        <Link to="/register">Sign up</Link>
                    </p>

                    {errors.map((error, index) => (
                        <div className="sf-error" key={index}>
                            Something went wrong. Please try again.
                        </div>
                    ))}
                </form>
            </div>
        </div>
    )
}

export default Login
