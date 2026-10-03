import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ServiceDetailPage from "./pages/ServiceDetailPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import JobDetailPage from "./pages/JobDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import EnquiryThankYouPage from "./pages/EnquiryThankYouPage.jsx";

const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const AdminLoginPage = lazy(() => import("./admin/AdminLoginPage.jsx"));
const PreviewRoot = lazy(() => import("./preview/PreviewRoot.jsx"));

export default function App() {
  return (
    <Routes>
      <Route path="/preview" element={<Suspense fallback={null}><PreviewRoot /></Suspense>}>
        <Route element={<MainLayout previewMode />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:id" element={<ServiceDetailPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="enquiry/thanks" element={<EnquiryThankYouPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogDetailPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
        </Route>
      </Route>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:id" element={<ServiceDetailPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="enquiry/thanks" element={<EnquiryThankYouPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin/login" element={<Suspense fallback={null}><AdminLoginPage /></Suspense>} />
      <Route path="/admin" element={<Suspense fallback={null}><AdminLayout /></Suspense>} />
    </Routes>
  );
}
