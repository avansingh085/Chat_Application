import React from 'react';
import { Link } from 'react-router-dom';


export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl flex flex-col md:flex-row items-center gap-8">

        <div className="flex-1 w-full md:w-1/2 flex items-center justify-center">
          <svg
            viewBox="0 0 600 600"
            className="w-64 h-64 md:w-80 md:h-80"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <circle cx="300" cy="300" r="280" fill="url(#g)" opacity="0.08" />
            <g transform="translate(120,120)">
              <rect x="0" y="0" width="240" height="160" rx="12" fill="#fff" opacity="0.85" />
              <path d="M16 120c24-40 72-64 112-64s88 24 112 64" fill="#eef2ff" />
              <text x="120" y="90" textAnchor="middle" fontSize="48" fill="#7c3aed" fontWeight="700">404</text>
            </g>
          </svg>
        </div>

        <div className="flex-1 w-full md:w-1/2">
          <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">Page not found</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">We can’t find the page you’re looking for. It might have been removed, had its name changed, or is temporarily unavailable.</p>

          <div className="mt-6 flex gap-3">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg shadow hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0V9h2a1 1 0 100-2h-2z" clipRule="evenodd" />
              </svg>
              Go home
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              Reload
            </button>
          </div>

          

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Tip: If you typed the web address, make sure it’s correct. Or try returning to the homepage or using the search.
          </div>
        </div>
      </div>
    </div>
  );
}
