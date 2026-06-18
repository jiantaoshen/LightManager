import preview from "../assets/preview.png"
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
    const navigate = useNavigate();

    return (
      <>
            <section className="relative overflow-hidden">
                <div className="absolute right-0 top-0 h-[100px] w-[100px] rounded-full bg-indigo-100 blur-3xl" />

                <div className="mx-auto grid max-w-screen-2xl gap-10 px-8 py-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              {/* Left Content */}
              <div>
                <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                  Project management
                  <br />
                  without
                  <br />
                  complexity
                </h1>

                <p className="mb-8 max-w-xl text-lg text-slate-600">
                    Plan projects, track progress, and keep your team aligned without the complexity of traditional project management and dedicate more time to delivering meaningful work.
                </p>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={() => navigate("/login")}>Start Free</Button>

                  <Button variant="ghost">Book a Demo</Button>
                </div>

                            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
                                <span>✓ Powerful enough for growing teams.</span>
                        <span>✓ Simple enough for everyone.</span>
                          <span>✓ Setup in minutes</span>
                </div>
              </div>

                      {/* Dashboard Preview */}
                      <div className="relative flex justify-center lg:justify-end">
                          <div className="w-full max-w-4xl lg:max-w-5xl">
                              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                                  <img
                                      src={preview}
                                      alt="Dashboard Preview"
                                      className="w-full h-auto scale-[1.05]"
                                  />
                              </div>
                          </div>
                      </div>
                      </div>
                </section>
      </>
  );
}
