import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom"


//my components           :
import AllCoursesPage from './Components/AllCoursesPage';
import MyCoursesPage from './Components/MyCoursesPage';
import LoginPage from './Components/LoginPage';
import SigninPage from './Components/SigninPage';
import MainLayout from './Components/MainLayout';
import CourseContents from './Components/CourseContentsPage';
import ContentXPage from './Components/ContentXPage';
import HomePage from './Components/HomePage';
import LandingPage from './Components/LandingPage';
import { getCurrentUser } from './Services/Auth_Service'





const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/Home", element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    )
  },
  {
    path: "/Courses", element: (
      <MainLayout >
        <AllCoursesPage />
      </MainLayout>
    )
  },
  {
    path: "/MyCourses", element: (

      <MainLayout >
        <MyCoursesPage />
      </MainLayout>
    )
  },
  { path: "/Login", element: <LoginPage /> },
  { path: "/Signin", element: <SigninPage /> },
  {
    path: "/Course/:CourseID", element: (
      <MainLayout >
        <CourseContents />
      </MainLayout>
    )
  },
  {
    path: "/Content/:ContentID", element: (
      <MainLayout >
        <ContentXPage />
      </MainLayout>
    )
  },
  {
    path: "*", element: (
      <MainLayout >
        <HomePage />
      </MainLayout>
    )
  }

]);



const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

