import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import ProgramDetail from "@/pages/ProgramDetail";
import Donate from "@/pages/Donate";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Volunteer from "@/pages/Volunteer";
import Contact from "@/pages/Contact";
import Gallery from "@/pages/Gallery";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DonorDashboard from "@/pages/DonorDashboard";
import DonorProfile from "@/pages/DonorProfile";
import DonorSponsorships from "@/pages/DonorSponsorships";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import VolunteerEvents from "@/pages/VolunteerEvents";
import VolunteerMessages from "@/pages/VolunteerMessages";
import Inbox from "@/pages/Inbox";
import Dashboard from "@/pages/Dashboard";
import BeneficiaryApply from "@/pages/BeneficiaryApply";
import BeneficiaryDashboard from "@/pages/BeneficiaryDashboard";
import BeneficiaryApplications from "@/pages/BeneficiaryApplications";
import BeneficiaryApplication from "@/pages/BeneficiaryApplication";
import BeneficiarySupport from "@/pages/BeneficiarySupport";
import NotFound from "@/pages/not-found";

// i18n setup
import "./i18n";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/programs" component={Programs} />
          <Route path="/programs/:slug" component={ProgramDetail} />
          <Route path="/donate" component={Donate} />
          <Route path="/events" component={Events} />
          <Route path="/events/:slug" component={EventDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/contact" component={Contact} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/donor/dashboard" component={DonorDashboard} />
          <Route path="/donor/profile" component={DonorProfile} />
          <Route path="/donor/sponsorships" component={DonorSponsorships} />
          <Route path="/volunteer/dashboard" component={VolunteerDashboard} />
          <Route path="/volunteer/events" component={VolunteerEvents} />
          <Route path="/volunteer/messages" component={VolunteerMessages} />
          <Route path="/inbox" component={Inbox} />
          <Route path="/beneficiary/apply" component={BeneficiaryApply} />
          <Route path="/beneficiary/dashboard" component={BeneficiaryDashboard} />
          <Route path="/beneficiary/applications" component={BeneficiaryApplications} />
          <Route path="/beneficiary/applications/:id" component={BeneficiaryApplication} />
          <Route path="/beneficiary/support" component={BeneficiarySupport} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
