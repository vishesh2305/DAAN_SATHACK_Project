// src/components/SplineScene.jsx
import React, { Suspense, lazy } from 'react';
import { LoaderCircle } from 'lucide-react';

// Spline is imported lazily for performance
const Spline = lazy(() => import('@splinetool/react-spline'));

/**
 * Renders the Spline 3D scene with a suspense fallback.
 */
export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  );
}

export default SplineScene;