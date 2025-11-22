import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Sparkles, Image as ImageIcon, BookOpen } from 'lucide-react';
import { fetchRandomPoem } from './services/poetryService';
import { analyzePoem, generatePoemImage } from './services/geminiService';
import { Poem, PoemAnalysis, AppState } from './types';
import { NeuButton } from './components/NeuButton';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [analysis, setAnalysis] = useState<PoemAnalysis | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const loadRandomPoem = useCallback(async () => {
    setState(AppState.LOADING_POEM);
    setError(null);
    setAnalysis(null);
    setGeneratedImage(null);
    
    try {
      const newPoem = await fetchRandomPoem();
      setPoem(newPoem);
      setState(AppState.IDLE);
    } catch (err) {
      setError("Failed to fetch a new poem. Please try again.");
      setState(AppState.ERROR);
    }
  }, []);

  useEffect(() => {
    loadRandomPoem();
  }, [loadRandomPoem]);

  const handleAnalyze = async () => {
    if (!poem) return;
    setState(AppState.ANALYZING);
    try {
      const result = await analyzePoem(poem);
      setAnalysis(result);
      setState(AppState.IDLE);
    } catch (err) {
      // Don't block UI, just log
      console.error(err);
      setState(AppState.IDLE);
    }
  };

  const handleGenerateImage = async () => {
    if (!poem) return;
    setState(AppState.GENERATING_IMAGE);
    try {
      const img = await generatePoemImage(poem);
      setGeneratedImage(img);
      setState(AppState.IDLE);
    } catch (err) {
      console.error(err);
      setState(AppState.IDLE);
    }
  };

  const isBusy = state !== AppState.IDLE && state !== AppState.ERROR;

  return (
    <div className="min-h-screen bg-neu-base text-neu-text font-sans selection:bg-neu-dark selection:text-neu-light p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neu-base shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] flex items-center justify-center text-neu-accent">
            <BookOpen size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neu-text">Poetry For You</h1>
        </div>
        
        <NeuButton 
          onClick={loadRandomPoem} 
          variant="circle" 
          disabled={isBusy}
          title="Get New Poem"
        >
          <RefreshCw size={20} className={isBusy ? "animate-spin" : ""} />
        </NeuButton>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl flex flex-col gap-8">
        
        {state === AppState.LOADING_POEM && <Loader />}

        {state === AppState.ERROR && (
          <div className="p-6 rounded-xl bg-neu-base shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-center text-red-400">
            {error}
          </div>
        )}

        {poem && state !== AppState.LOADING_POEM && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Poem Card */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <article className="neu-card p-8 md:p-12 min-h-[400px] flex flex-col relative overflow-hidden">
                 {/* Decorative quote mark */}
                <div className="absolute top-4 left-6 text-8xl font-serif text-neu-dark opacity-10 pointer-events-none">"</div>
                
                <header className="mb-8 z-10">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2 leading-tight">
                    {poem.title}
                  </h2>
                  <p className="text-lg text-neu-accent font-medium italic">
                    — {poem.author}
                  </p>
                </header>

                <div className="font-serif text-lg leading-loose text-gray-700 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar z-10">
                  {poem.lines.map((line, idx) => (
                    <p key={idx} className={`${line === '' ? 'h-6' : 'mb-2'}`}>
                      {line === '' ? <br/> : line}
                    </p>
                  ))}
                </div>
              </article>

              {/* Controls */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <NeuButton 
                  variant="pill" 
                  onClick={handleAnalyze}
                  disabled={isBusy || !!analysis}
                  active={state === AppState.ANALYZING}
                  icon={<Sparkles size={18} />}
                >
                  {state === AppState.ANALYZING ? 'Thinking...' : 'Analyze Theme'}
                </NeuButton>

                <NeuButton 
                  variant="pill" 
                  onClick={handleGenerateImage}
                  disabled={isBusy || !!generatedImage}
                  active={state === AppState.GENERATING_IMAGE}
                  icon={<ImageIcon size={18} />}
                >
                  {state === AppState.GENERATING_IMAGE ? 'Painting...' : 'Visualize'}
                </NeuButton>
              </div>
            </div>

            {/* Sidebar: Analysis & Visualization */}
            <div className="flex flex-col gap-8">
              
              {/* Analysis Panel */}
              {(analysis || state === AppState.ANALYZING) && (
                <div className="neu-card p-6 animate-fade-in">
                  <h3 className="text-lg font-bold mb-4 text-neu-accent flex items-center gap-2">
                    <Sparkles size={16} /> AI Insight
                  </h3>
                  {state === AppState.ANALYZING ? (
                    <Loader />
                  ) : analysis ? (
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="font-bold text-gray-600 block mb-1">Mood</span>
                        <p className="text-gray-500">{analysis.mood}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-600 block mb-1">Themes</span>
                        <div className="flex flex-wrap gap-2">
                          {analysis.themes.map((t, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-neu-base shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-gray-600 block mb-1">Summary</span>
                        <p className="text-gray-500 italic leading-relaxed">{analysis.summary}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Image Panel */}
              {(generatedImage || state === AppState.GENERATING_IMAGE) && (
                <div className="neu-card p-4 animate-fade-in">
                   <h3 className="text-lg font-bold mb-4 text-neu-accent flex items-center gap-2 px-2">
                    <ImageIcon size={16} /> Visualization
                  </h3>
                  {state === AppState.GENERATING_IMAGE ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader />
                    </div>
                  ) : generatedImage ? (
                    <div className="rounded-xl overflow-hidden shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] p-1 bg-neu-base">
                      <img 
                        src={generatedImage} 
                        alt="AI Visualization of the poem" 
                        className="w-full h-auto rounded-lg shadow-md opacity-90 hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                  ) : null}
                </div>
              )}

              {/* Empty State Placeholders for Sidebar if nothing loaded yet */}
              {!analysis && !generatedImage && state !== AppState.ANALYZING && state !== AppState.GENERATING_IMAGE && (
                <div className="hidden lg:flex flex-col items-center justify-center h-full opacity-30 text-center p-4">
                  <div className="mb-4 text-6xl">✨</div>
                  <p>Tap "Analyze Theme" or "Visualize" to see AI interpretations here.</p>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto pt-12 pb-4 text-center text-gray-400 text-sm">
        <p>Powered by <a href="https://poetrydb.org" className="hover:text-neu-accent underline">PoetryDB</a> & Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
