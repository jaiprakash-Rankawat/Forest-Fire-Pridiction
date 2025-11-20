export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-3xl mr-2">🔥</span>
              Forest Fire Prediction
            </h3>
            <p className="text-gray-400">
              Educational platform dedicated to understanding, predicting, and preventing forest fires through research-backed information.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-fire-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/prediction" className="text-gray-400 hover:text-fire-400 transition-colors">
                  AI Prediction
                </a>
              </li>
              <li>
                <a href="/evidence" className="text-gray-400 hover:text-fire-400 transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="/prevention" className="text-gray-400 hover:text-fire-400 transition-colors">
                  Prevention
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Emergency</h4>
            <p className="text-gray-400 mb-2">
              If you see a wildfire:
            </p>
            <p className="text-fire-400 font-bold text-2xl">Call 911</p>
            <p className="text-gray-400 mt-4 text-sm">
              Report smoke or fire immediately. Do not assume someone else has called.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Forest Fire Prediction. Educational purposes only.</p>
          <p className="mt-2">Data sourced from NASA, NOAA, Cal Fire, and peer-reviewed research.</p>
        </div>
      </div>
    </footer>
  );
}
