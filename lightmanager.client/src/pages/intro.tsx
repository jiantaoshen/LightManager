import preview from "../assets/preview.png"
export default function IntroPage() {
    return (
      <>
          <section className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-[100px] w-[100px] rounded-full bg-indigo-100 blur-3xl" />

            <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center">
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
                  <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700">
                    Start Free
                  </button>

                  <button className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
                    Book a Demo
                  </button>
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
