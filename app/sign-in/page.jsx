"use client";
import { useSignupMutation, useVerifyLoginFeildsMutation } from "@/redux/auth/authApi";
import { ChangeUser } from "@/redux/auth/authSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {  useRouter } from "next/navigation";
import { useSelector } from "react-redux";
export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { referralUserId, language } = useSelector((state) => state.auth) || {};
  const [verifyLoginFeidls, { isLoading: verifyLoginFeidlsLoading }] =
    useVerifyLoginFeildsMutation();

  const [signUp, { isLoading: signUpIsLoading }] = useSignupMutation();

  const baseSchema =Yup.object({
    id: Yup.string().required("User id is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  });
  const signupSchema = baseSchema.shape({
    name: Yup.string().required('User name is required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
   phone: Yup.string()
    .required("Phone Number is Required")
   .test(
    'is-valid-phone',
    'Enter a valid phone number',
    (v) => !!v && isValidPhoneNumber(v)   // <- require non-empty here too
  ),
})

  const validationSchema = isSignUp ? signupSchema : baseSchema;
  
  // Login handler
  const handleLogin = async (values,{resetForm}) => {
    if(isSignUp){
      if(values.phone.startsWith("+92")){
        toast.error("Pakistani contact numbers are not allowed for signup.")
        return;
      }
    }
    // return;
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("userid", values.id);
    formData.append("secretkey", values.password);
    formData.append("applicationtype", "dss");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(values.id)) {
      formData.append("isemail", "1");
    } else {
      formData.append("isemail", "0");
    }

    if(!isSignUp){
      const res = await verifyLoginFeidls(formData);
      const { error, data: respData } = res || {};
      if (respData) {
        if (
          respData?.result?.userdetail?.[0]?.client_verification_status == "1"
        ) {
          dispatch(
            ChangeUser({
              ...respData?.result?.userdetail?.[0],
              isVerified: true,
            })
          );
        } else if (
          respData?.result?.userdetail?.[0]?.client_verification_status == "0"
        )
          dispatch(
            ChangeUser({
              ...respData?.result?.userdetail?.[0],
              isVerified: false,
            })
          );
        else toast.error("Invalid Credentials");
      }
      if (error) {
        toast.error(error || "error");
      }
    } else {
      const payloads = {
        phoneNumber: values.phone,
        email: values.id,
        name: values.name,
        referById: referralUserId,
        appNameCode: "dss",
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      };
      const response = await signUp(payloads);
      const {error,data: resData} = response || {};
      if(resData?.result == "Email Already Exist"){
        toast.error(resData?.result || "User Already Exist")
        return
      }
      if(resData?.result == "Pakistani contact numbers are not allowed for signup."){
        toast.error(resData?.result || "Pakistani contact numbers are not allowed for signup.")
        return
      }
      if(resData){
        resetForm();
        toast.success("Sign up successful.");
        router.push("/sign-in");
        setIsSignUp(false);
      }
    }
  };

  return (
    <>
      <section className="bg-[#FFFFFF]">
        {/* Login/Signup Form */}
        <div className="container mx-auto py-8">
          <div className="grid md:grid-cols-2 justify-center items-center">
            <div className="w-full animate-slowBounce">
              <Image src="/login/login.svg" width={600} height={589} alt="" />
            </div>

            <div className="w-full px-8 border-2 shadow-2xl rounded-xl pb-8 flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <div className="!w-[430px] flex justify-center items-center">
                  <img
                    src="/login/logo.png"
                    className="w-full h-full"
                    // width={384}
                    // height={60}
                    alt="Company Logo"
                  />
                </div>

                <Formik
                 enableReinitialize
                  initialValues={{
                    id: "",
                    password: "",
                    rememberMe: false,
                    ...(isSignUp && { name: '', confirmPassword: '', phone: '' }),
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleLogin}
                >
                  {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="w-full">

                      {/* Name */}

                      {isSignUp && (
                        <div className="mb-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          User name
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          placeholder="User name"
                          className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red text-sm"
                        />
                        </div>
                      )}
                      {isSignUp && (
                        <div className="mb-4">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            <pre>Phone number</pre>
                          </label>
                          <PhoneInput
                            id="phone"
                            name="phone"
                            international                 // shows country selector + codes
                            defaultCountry="PK"           // pick a sensible default for your users
                            value={values.phone}
                            onChange={(val) => setFieldValue('phone', val)}
                            onBlur={() => setFieldTouched('phone', true)} 
                          />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-red text-sm"
                          />
                        </div>
                      )}



                      {/* Email Field */}
                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {isSignUp ? "Email" : "Email or ID"}
                        </label>
                        <Field
                          type="text"
                          id="id"
                          name="id"
                          placeholder="User ID"
                          className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="id"
                          component="div"
                          className="text-red text-sm"
                        />
                      </div>

                      {/* Password Field */}
                      <div className="mb-4 relative">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <Field
                          type={passwordVisible ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                        >
                          {passwordVisible ? (
                            <HiEyeOff size={24} />
                          ) : (
                            <HiEye size={24} />
                          )}
                        </button>
                      </div>

                      {/* Confirm Password Field */}
                      {isSignUp && (
                        <div className="mb-4 relative">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <Field
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmPasswordVisible(!confirmPasswordVisible)
                            }
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                          >
                            {confirmPasswordVisible ? (
                              <HiEyeOff size={24} />
                            ) : (
                              <HiEye size={24} />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Remember Me Checkbox */}
                      {!isSignUp && (
                        <div className="mb-4 flex items-center">
                        <Field
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          className="h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Remember Me
                        </label>
                      </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex flex-col justify-center items-center py-10">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-primary w-[219px] h-[40px] text-white px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {isSubmitting
                            ? "Processing..."
                            : isSignUp
                            ? "Sign Up"
                            : "Login"}
                        </button>
                      </div>

                      {/* Form Footer */}
                      <div className="py-3 flex justify-between gap-4">
                        <p className="text-grey p3 text-center">
                          {isSignUp
                            ? "Already have an account?"
                            : "Create New Account"}
                          <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-primary font-bold md:ms-2"
                          >
                            {isSignUp ? "Login" : "Signup"}
                          </button>
                        </p>
                        {!isSignUp && (
                          <p className="text-grey p3 text-center">
                            Forgot Password ?
                          </p>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}