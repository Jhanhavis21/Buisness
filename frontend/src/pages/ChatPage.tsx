import { FormEvent, useState } from 'react';
import type { ChatResponse } from '../types/api';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResponse(null);

    if (!message.trim()) {
      setError('Please enter a message to send.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.sendChatMessage({ message });
      setResponse(result.data);
      setMessage('');
    } catch (err) {
      const serverMessage = (err as any)?.response?.data?.message;
      setError(serverMessage ?? (err instanceof Error ? err.message : 'Unable to send chat message. Check your backend connection and try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Chat Workspace</h1>
        <p className="mt-1 text-sm text-slate-400">Send a message to the AI backend and receive an AI-powered reply (requires GEMINI_API_KEY configured in backend).</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-200">Conversation</p>
            <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">
              {isLoading ? 'Sending...' : 'Ready'}
            </div>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              placeholder='Ask something like "What are the current deal totals?"'
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isLoading}
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              Send message
            </button>
          </form>

          {error ? <ErrorState title="Chat failed" message={error} /> : null}

          {response ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Response</p>
              <p className="mt-2 whitespace-pre-wrap">{response.reply}</p>
              {response.input ? (
                <p className="mt-3 text-xs text-slate-400">You asked: {response.input}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card title="Pending Actions" value="0" subtitle="No live agent calls yet" tone="accent" />
          <LoadingState label="Awaiting backend connection" />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

