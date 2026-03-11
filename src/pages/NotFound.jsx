import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="rounded-2xl max-w-md w-full shadow-xl border border-base-300/40 bg-base-100">
        <div className="p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-error/10 flex items-center justify-center border border-error/20">
              <AlertCircle size={36} className="text-error" />
            </div>
          </div>

          <h1 className="text-5xl font-extrabold mb-2 text-error/20">404</h1>
          <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
          <p className="mb-8 text-base-content/60 text-sm leading-relaxed">The page you're looking for doesn't exist or has been moved.</p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/" className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
              <Home size={16} />
              Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-ghost gap-2">
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
