import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  isDone: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  isStreaming,
  isDone,
  error,
  onRetry,
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 opacity-70" />
        <p className="text-sm text-slate-400">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Retry Analysis
          </button>
        )}
      </div>
    );
  }

  if (!text && isStreaming) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        <p className="text-xs text-slate-500 font-mono">
          ORBIT is scanning intelligence sources...
        </p>
      </div>
    );
  }

  return (
    <div className={`orbit-prose ${isStreaming ? 'streaming-cursor' : ''}`}>
      <ReactMarkdown>{text}</ReactMarkdown>
      {isStreaming && !isDone && (
        <span className="inline-block w-1 h-4 bg-blue-400 ml-0.5 animate-cursor align-text-bottom" />
      )}
    </div>
  );
};
