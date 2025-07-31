"use client";
import DropdownDrawerButton from "@/components/DropdownDrawerButton";
import { appNameCode } from "@/config";
import {
  useSignupMutation,
  useVerifyLoginFeildsMutation,
} from "@/redux/auth/authApi";
import { changeLanguage, ChangeUser } from "@/redux/auth/authSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

// Constants for reusable values
const FORM_INITIAL_VALUES = {
  id: "",
  password: "",
  rememberMe: false,
  name: "",
  email: "",
  number: "",
  confirmPassword: "",
};

const AuthForm = ({ isSignUp, toggleAuthMode, onSubmit, isSubmitting }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  return (
    <div className="w-full px-8 border-2 shadow-2xl rounded-xl pb-8 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="!w-64 flex justify-center items-center">
          <Image
            src="/login/logo.png"
            className="w-full h-full"
            width={384}
            height={60}
            alt="Company Logo" style={{
    width: 'auto', // Add this to maintain ratio when resizing
    height: 'auto' // Add this if you're using CSS to resize
  }}
          />
        </div>

        <Formik
          initialValues={FORM_INITIAL_VALUES}
          validationSchema={getValidationSchema(isSignUp)}
          onSubmit={onSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form className="w-full">
              {isSignUp ? (
                <>
                  <FormField
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="User Name"
                  />
                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="abc@gmail.com"
                  />
                  <FormField
                    name="number"
                    label="Phone Number"
                    type="text"
                    placeholder="1234567890"
                  />
                </>
              ) : (
                <FormField
                  name="id"
                  label="User ID"
                  type="text"
                  placeholder="User ID"
                />
              )}

              <PasswordField
                name="password"
                label="Password"
                placeholder="Enter your password"
                visible={passwordVisible}
                toggleVisibility={togglePasswordVisibility}
              />

              {isSignUp && (
                <PasswordField
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  visible={confirmPasswordVisible}
                  toggleVisibility={toggleConfirmPasswordVisibility}
                />
              )}

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

              <SubmitButton
                isSubmitting={formikSubmitting || isSubmitting}
                label={isSignUp ? "Sign Up" : "Login"}
              />

              <FormFooter
                isSignUp={isSignUp}
                toggleAuthMode={toggleAuthMode}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const FormField = ({ name, label, type, placeholder }) => (
  <div className="mb-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

const PasswordField = ({
  name,
  label,
  placeholder,
  visible,
  toggleVisibility,
}) => (
  <div className="mb-4 relative">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      type={visible ? "text" : "password"}
      id={name}
      name={name}
      placeholder={placeholder}
      className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <HiEyeOff size={24} /> : <HiEye size={24} />}
    </button>
  </div>
);

const SubmitButton = ({ isSubmitting, label }) => (
  <div className="flex flex-col justify-center items-center py-10">
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-primary w-[219px] h-[40px] text-white px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
    >
      {isSubmitting ? "Processing..." : label}
    </button>
  </div>
);

const FormFooter = ({ isSignUp, toggleAuthMode }) => (
  <div className="pt-2 flex justify-between gap-4">
    <p className="text-grey text-center">
      {isSignUp ? "Already have an account?" : "Create New Account"}
      <button
        type="button"
        onClick={toggleAuthMode}
        className="text-primary font-bold md:ms-2"
      >
        {isSignUp ? "Login" : "Signup"}
      </button>
    </p>
    {!isSignUp && (
      <p className="text-grey text-center">Forgot Password ?</p>
    )}
  </div>
);

const getValidationSchema = (isSignUp) => {
  const baseSchema = {
    id: Yup.string().required("User ID is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  };

  if (isSignUp) {
    return Yup.object({
      ...baseSchema,
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      number: Yup.string().required("Phone number is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    });
  }

  return Yup.object(baseSchema);
};

const LanguageChangeModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Do you want to change language?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SignInPage() {
  const { referralUserId, language } = useSelector((state) => state.auth) || {};
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  const dispatch = useDispatch();
  const [signupUser, { isLoading: signupUserLoading }] = useSignupMutation();
  const [verifyLoginFeidls, { isLoading: verifyLoginFeidlsLoading }] =
    useVerifyLoginFeildsMutation();

  const toggleAuthMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
  }, []);

  const handleLogin = useCallback(async (values) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("userid", values.id);
      formData.append("secretkey", values.password);
      formData.append("applicationtype", appNameCode);
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      formData.append("isemail", emailRegex.test(values.id) ? "1" : "0");

      const res = await verifyLoginFeidls(formData);
      const { error, data: respData } = res || {};

      if (respData) {
        const verificationStatus = respData?.result?.userdetail?.[0]?.client_verification_status;
        if (verificationStatus === "1" || verificationStatus === "0") {
          dispatch(
            ChangeUser({
              ...respData?.result?.userdetail?.[0],
              isVerified: verificationStatus === "1",
            })
          );
        } else {
          toast.error("Invalid Credentials");
        }
      }

      if (error) {
        toast.error(error.data?.message || "An error occurred");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, verifyLoginFeidls]);

  const handleLanguageChange = useCallback((language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(true);
  }, []);

  const confirmLanguageChange = useCallback(() => {
    if (selectedLanguage) {
      dispatch(changeLanguage(selectedLanguage));
    }
    setShowLanguageModal(false);
  }, [dispatch, selectedLanguage]);

  const cancelLanguageChange = useCallback(() => {
    setShowLanguageModal(false);
    setSelectedLanguage(null);
  }, []);

  const handleSignUp =useCallback(async(values) => {
    setIsSubmitting(true);
    try {
    const payload={
      name:values.name,
      email: values.email,
      newPassword: values.password,
      confirmPassword: values.confirmPassword,
      phoneNumber:values.number,
      appNameCode:appNameCode,
      referById:referralUserId,
    }

      const res = await signupUser(payload);
      const { error, data: respData } = res || {};

      if (respData) {
        const verificationStatus = respData?.result?.userdetail?.[0]?.client_verification_status;
        if (verificationStatus === "1" || verificationStatus === "0") {
          dispatch(
            ChangeUser({
              ...respData?.result?.userdetail?.[0],
              isVerified: verificationStatus === "1",
            })
          );
        } else {
          toast.error("Invalid Credentials");
        }
      }

      if (error) {
        toast.error(error.data?.message || "An error occurred");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, signupUser])
  return (
    <>
      <section className="bg-[#FFFFFF] relative">
        <div className="container mx-auto py-14">
          <div className="grid md:grid-cols-2 justify-center items-center">
            <div className="w-full animate-slowBounce">
              <Image 
                src="/login/login.svg" 
                width={600} 
                height={589} 
                alt="Login Illustration"
                priority 
              />
            </div>

            <AuthForm
              isSignUp={isSignUp}
              toggleAuthMode={toggleAuthMode}
              onSubmit={isSignUp ? handleSignUp : handleLogin}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </section>

      <Toaster position="top-right" reverseOrder={false} />

      <LanguageChangeModal
        show={showLanguageModal}
        onConfirm={confirmLanguageChange}
        onCancel={cancelLanguageChange}
      />
    </>
  );
}