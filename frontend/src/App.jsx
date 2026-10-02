import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
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
import AdminLoginPage from "./admin/AdminLoginPage.jsx";
import PreviewRoot from "./preview/PreviewRoot.jsx";
import EnquiryThankYouPage from "./pages/EnquiryThankYouPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/preview" element={<PreviewRoot />}>
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
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />} />
    </Routes>
  );
}
