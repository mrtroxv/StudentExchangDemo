// ** React Imports
import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin"
import useJwt from "@src/auth/jwt/useJwt"
import logo from "@src/assets/images/logo/AARU.png"

// ** Third Party Components
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
// import { useForm, Controller } from 'react-hook-form'
import { HelpCircle, Coffee, X } from "react-feather"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
// ** Actions
import { handleLogin } from "@store/authentication"

// ** Context
import { AbilityContext } from "@src/utility/context/Can"

// ** Custom Components
import Avatar from "@components/avatar"
import InputPasswordToggle from "@components/input-password-toggle"

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  UncontrolledTooltip
} from "reactstrap"

// ** Styles
import "@styles/react/pages/page-authentication.scss"
import { useTranslation } from "react-i18next"

const ToastContent = ({ t, name, role }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>You have successfully logged in as an {role} user.</span>
      </div>
    </div>
  )
}

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)

  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      const logInData = useJwt.login({
        Username: data.Username,
        password: data.password
      })
      const handleLoginData = logInData.then((res) => {
        const data = { ...res.data, accessToken: res.data.accessToken }
        dispatch(handleLogin(data))
        ability.update(res.data.ability)
        toast((t) => (
          <ToastContent
            t={t}
            role={data.role}
            name={data.fullName || data.username}
          />
        ))
        return data
      })
      const handleRedirect = handleLoginData.then((data) => {
        navigate(getHomeRouteForLoggedInUser(data.role))
      })
      handleRedirect.catch((error) => {
        toast.error(error.message)
      })
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual"
          })
        }
      }
    }
  }
  const SignInSchema = Yup.object().shape({
    Username: Yup.string().required("No Username provided"),
    password: Yup.string()
      .required("No password provided.")
      .min(4, "Password is too short - should be 4 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
  })
  const { t } = useTranslation()

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src={logo} height="40" />
          <h2 className="brand-text text-primary ms-1">Internship Manager</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              {t("signIn")} 👋
            </CardTitle>
            <CardText className="mb-2">{t("signInSubTitle")}</CardText>
            <Formik
              initialValues={{
                password: "",
                Username: ""
              }}
              validationSchema={SignInSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => (
                <Form className="auth-login-form mt-2">
                  <div className="mb-2">
                    <Label className="form-label" for="email">
                      {t("User Name")}
                    </Label>
                    <Field
                      name="Username"
                      id="Username"
                      placeholder="Username"
                      type="text"
                      className={`form-control ${
                        errors.Username && touched.Username ? "is-invalid" : ""
                      }`}
                      autoFocus
                    />
                    <ErrorMessage
                      name="Username"
                      component="p"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between">
                      <Label className="form-label" for="password">
                        {t("Password")}
                      </Label>
                      <Link to="/forgot-password">
                        <small>{t("forgotPassword")}</small>
                      </Link>
                    </div>
                    <Field
                      name="password"
                      id="password"
                      placeholder="············"
                      className={`form-control ${
                        errors.password && touched.password ? "is-invalid" : ""
                      }`}
                      type="password"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-check mb-1">
                    <Field
                      name="remember-me"
                      id="remember-me"
                      type="checkbox"
                      className="form-check-input"
                    />
                    <Label className="form-check-label" for="remember-me">
                      Remember Me
                    </Label>
                  </div>
                  <Button type="submit" color="primary" block>
                    {t("signIn")}
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
