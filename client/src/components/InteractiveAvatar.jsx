// ---
// PASTE THIS ENTIRE CODE BLOCK INTO:
// src/components/InteractiveAvatar.jsx
// ---

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import { LoaderCircle } from 'lucide-react';

// --- This is your 3D model component ---
function AvatarModel({ modelPath, animationName }) {
  const group = useRef();
  
  // 1. Load the model from the correct API path
  const { scene, animations } = useGLTF(modelPath);
  
  // 2. Set up animations
  const { actions } = useAnimations(animations, group);

  // 3. Play animations
  useEffect(() => {
    // Stop all other animations
    Object.values(actions).forEach(action => action.stop());
    
    // Play the new one
    if (actions[animationName]) {
      actions[animationName].reset().fadeIn(0.3).play();
    }
    
    // Optional: cleanup
    return () => {
      if (actions[animationName]) {
        actions[animationName].fadeOut(0.3);
      }
    };
  }, [animationName, actions]);

  // 4. RETURN THE MODEL
  // ---
  // *** THIS IS THE FIX FOR "small and out of the box" ***
  // I've increased the 'scale' and adjusted the 'position'
  // to make the model bigger and centered.
  // ---
  return (
    <primitive 
      ref={group} 
      object={scene} 
      scale={3.2} // <-- BIGGER
      position={[0, -3.4, 0]} // <-- CENTERED
    />
  );
}

// --- This is the speech bubble component ---
function SpeechBubble({ message }) {
  // ---
  // *** NEW SETTINGS ***
  // Moved the bubble up to match the new model scale
  // ---
  return (
    <Html position={[0, 2.2, 0]} center> 
      <div className="max-w-xs p-3 text-sm text-center text-gray-800 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white ring-1 ring-gray-200 dark:ring-gray-700">
        <p>{message}</p>
      </div>
    </Html>
  );
}

// --- This component shows a loading spinner ---
function ModelLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-gray-500">
        <LoaderCircle className="w-10 h-10 animate-spin" />
        <p className="mt-2 text-sm">Loading Guide...</p>
      </div>
    </Html>
  );
}

// --- Main Avatar Component ---
const InteractiveAvatar = ({ currentStep, focusedField, hasErrors }) => {
  const [message, setMessage] = useState("Hi there! Let's get your campaign started.");
  const [animation, setAnimation] = useState('Idle'); // Default animation
  
  // ---
  // 1. THIS IS THE FIX FOR "not giving any animations"
  // This is the correct API link that INCLUDES all animations.
  // ---
  const modelPath = 'https://api.readyplayer.me/v1/avatars/690f1bb0602baf51af32b51b.glb';

  // ---
  // 2. THIS IS THE FIX FOR ANIMATION NAMES
  // These are the correct names from your model file:
  // ('Failure', 'Thinking', 'Talking', 'Victory', 'Idle')
  // ---
  useEffect(() => {
    if (hasErrors) {
      setMessage("Hmm, looks like something needs fixing in this step.");
      setAnimation('Failure'); // <-- CORRECT NAME
      return;
    }

    if (focusedField) {
      switch (focusedField) {
        case 'title':
          setMessage("A great title is key! What's it called?");
          setAnimation('Thinking'); // <-- CORRECT NAME
          break;
        case 'description':
          setMessage("Tell your story! What's the 'why' behind your idea?");
          setAnimation('Talking'); // <-- CORRECT NAME
          break;
        case 'fundingGoal':
          setMessage("Let's set a goal. Be realistic but ambitious!");
          setAnimation('Thinking'); // <-- CORRECT NAME
          break;
        case 'media':
          setMessage("Show, don't just tell! A great image is powerful.");
          setAnimation('Idle'); // <-- CORRECT NAME
          break;
        default:
          setMessage("Let's fill this part out.");
          setAnimation('Thinking');
      }
      return;
    }
    
    switch (currentStep) {
      case 1:
        setMessage("Let's start with the basics. What's your big idea?");
        setAnimation('Idle');
        break;
      case 2:
        setMessage("Great! Now, let's craft your story.");
        setAnimation('Idle');
        break;
      case 3:
        setMessage("Time to talk numbers. What's your funding goal?");
        setAnimation('Idle');
        break;
      case 4:
        setMessage("Looking good! Now for the visuals.");
        setAnimation('Idle');
        break;
      case 5:
        setMessage("We're at the final step! Let's review everything.");
        setAnimation('Victory'); // <-- CORRECT NAME
        break;
      default:
        setMessage("Let's get started!");
        setAnimation('Idle');
    }

  }, [currentStep, focusedField, hasErrors]);

  // Preload the model
  useGLTF.preload(modelPath);

  return (
    // ---
    // *** THIS IS THE FIX FOR "not big enough" ***
    // I've adjusted the camera position and fov (zoom)
    // ---
    <Canvas camera={{ position: [0, 0, 7.5], fov: 28 }}> 
      {/* Add better lighting */}
      <ambientLight intensity={1.0} /> 
      <directionalLight 
        position={[3, 3, 5]} 
        intensity={2.0} 
        castShadow 
      />
      <directionalLight 
        position={[-3, 3, -5]} 
        intensity={1.0} 
        color="#E0F0FF"
      />

      <Suspense fallback={<ModelLoader />}>
        <AvatarModel modelPath={modelPath} animationName={animation} />
        <SpeechBubble message={message} />
      </Suspense> 
      {/* *** THIS WAS THE BUG ***
        The line below used to say </Grommet>
        It is now fixed.
      */}
    </Canvas>
  );
};

export default InteractiveAvatar;