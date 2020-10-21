import React, { useState, useEffect } from "react";
import SignupForm from "./SignupForm";
import axios from "axios";
import * as yup from 'yup'
import schema from "./validation/signupFormSchema"

const initialSignupValues = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
};

const initialFormErrors = {
  username: '',
  password: '',
  first_name: '',
  last_name: '',
  email: ''
}

const initialDisabled = true;
const Signup = () => {
  const [signupValues, setSignupValues] = useState(initialSignupValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [disabled, setDisabled] = useState(initialDisabled)

  const inputChange = (e) => {
    e.persist()
    yup
      .reach(schema, e.target.name)
      .validate(e.target.value)
      .then(()=> {
        setFormErrors({
          ...formErrors,
          [e.target.name]: "",
        })
      })
      .catch((err) => {
        console.log("errors")
        setFormErrors({
          ...formErrors,
          [e.target.name]: err.errors[0],
        })
      })

    setSignupValues({
      ...signupValues,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://expatjournal-api.herokuapp.com/api/auth/register",
        signupValues
      )
      .then((res) => {
        console.log(res.data);
      });
    setSignupValues(initialSignupValues);
  };

  useEffect(() => {
    schema.isValid(signupValues).then((valid) => {
      setDisabled(!valid)
    })
  }, [signupValues])

  return (
    <SignupForm
      values={signupValues}
      change={inputChange}
      submit={submitForm}
      errors={formErrors}
      disabled={disabled}
    />
  );
}

export default Signup
