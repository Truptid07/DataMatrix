import Features from "../components/Home/Features";
import Logo from "../components/Logo";
import Hero from "../components/Home/Hero";

function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#8B5A9F] flex flex-col overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-lg animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-purple-300/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-indigo-300/25 rounded-full blur-lg animate-bounce" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Logo Section - Enhanced */}
      <div className="flex-shrink-0 relative z-10">
        <Logo />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 relative z-10">
        <Hero />
      </div>

      {/* Features Section - Bottom */}
      <div className="flex-shrink-0 pb-4 relative z-10">
        <Features />
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
    </div>
  );
}

export default Home;
