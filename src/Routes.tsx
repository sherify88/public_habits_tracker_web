import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const HabitsPage = React.lazy(() => import("pages/HabitsPage"));

const ProjectRoutes = () => {
  return (
    <React.Suspense fallback={<>Loading...</>}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/habits" replace />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="*" element={<Navigate to="/habits" replace />} />

        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
