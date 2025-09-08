import React from "react";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import CallPage from "./pages/CallPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnBoardingPage from "./pages/OnBoardingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { Navigate } from "react-router";
import Layout from "../src/components/Layout.jsx";

import toast, { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  //zustand global hook
  const { theme, setTheme } = useThemeStore();

  return (
    // axios and react query -> for production grade app
    <div className="h-screen " data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar></Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to="/onboarding" />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/notification"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            !isLoading ? (
              isAuthenticated && isOnboarded ? (
                <CallPage />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            ) : (
              <PageLoader />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Navigate to="/" />
              ) : (
                <OnBoardingPage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
