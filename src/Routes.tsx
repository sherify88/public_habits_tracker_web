import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

const HabitsPage = React.lazy(() => import("pages/HabitsPage"));

const ProjectRoutes = () => {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/habits" replace />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="*" element={<Navigate to="/habits" replace />} />
          </Routes>
        </Layout>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
