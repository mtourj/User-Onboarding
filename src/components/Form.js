import React from "react";

import * as Formik from "formik";
import * as Yup from "yup";
import axios from "axios";

import { Spinner } from 'reactstrap';

import "./Form.scss";

const Form = props => {
  return (
    <Formik.Form>
      <div>
        {props.touched.name && <p className='error'>{props.errors.name}</p>}
        <Formik.Field type="name" name="name" placeholder="Name" />
      </div>
      <div>
        {props.touched.email && <p className='error'>{props.errors.email}</p>}
        <Formik.Field type="email" name="email" placeholder="Email" />
      </div>
      <div>
        {props.touched.password && <p className='error'>{props.errors.password}</p>}
        <Formik.Field type="password" name="password" placeholder="Password" />
      </div>
      <label>
        {props.touched.tos && <p className='error'>{props.errors.tos}</p>}
        <Formik.Field type="checkbox" name="tos" checked={props.values.tos} />
        I accept the Terms of Service
      </label>
      {
        props.isSubmitting && <Spinner />
      }
      <button type='submit' disabled={props.isSubmitting}>Submit</button>
    </Formik.Form>
  );
};

export default Formik.withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Email not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters or longer")
      .required("Password is required")
  }),
  handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
    if(values.email === "waffle@syrup.com"){
      setErrors({email: `${values.email} is already in use`})
    } else if(values.tos === false){
      setErrors({ tos: "Please accept the terms of service to continue." })
    }
    else {
      setSubmitting(true);
    axios
      .post("https://reqres.in/api/users")
      .then(res => {
        setSubmitting(false);
        console.log(res);
        window.alert(`Success! Account has been created at ${res.data.createdAt}, your id is ${res.data.id}`);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
})(Form);
